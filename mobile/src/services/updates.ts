import { Platform, Alert, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import api from './api';

export interface UpdateInfo {
  currentVersion: string;
  minRequiredVersion: string;
  hasUpdate: boolean;
  updateAvailable: boolean;
  forceUpdate: boolean;
  downloadUrl: string;
  releaseNotes: string;
  releasedAt: string;
}

const APP_VERSION = '1.0.0'; // Match this with app.json version

export const updateService = {
  /**
   * Check if app update is available from backend
   */
  async checkForUpdates(): Promise<UpdateInfo | null> {
    try {
      const response = await api.get<UpdateInfo>(
        `/api/app/version?version=${APP_VERSION}&platform=${Platform.OS}`
      );

      if (response.status === 200) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return null;
    }
  },

  /**
   * Check and notify user if update is available
   */
  async checkAndNotifyUpdate(): Promise<void> {
    try {
      const updateInfo = await this.checkForUpdates();

      if (!updateInfo) {
        console.log('Could not fetch update info');
        return;
      }

      // Force update if below minimum version
      if (updateInfo.forceUpdate) {
        this.showForceUpdateDialog(updateInfo);
        return;
      }

      // Notify user if optional update is available
      if (updateInfo.updateAvailable) {
        this.showOptionalUpdateDialog(updateInfo);
        return;
      }

      console.log('App is up to date');
    } catch (error) {
      console.error('Error in checkAndNotifyUpdate:', error);
    }
  },

  /**
   * Show force update dialog (user must update)
   */
  showForceUpdateDialog(updateInfo: UpdateInfo): void {
    Alert.alert(
      '⚠️ Critical Update Required',
      `Version ${updateInfo.currentVersion} is now required.\n\nPlease update your app to continue using all features.\n\nRelease Notes:\n${updateInfo.releaseNotes.substring(0, 200)}...`,
      [
        {
          text: 'Update Now',
          onPress: () => {
            this.openDownloadPage(updateInfo.downloadUrl);
          },
          style: 'default',
        },
      ]
    );
  },

  /**
   * Show optional update dialog
   */
  showOptionalUpdateDialog(updateInfo: UpdateInfo): void {
    Alert.alert(
      '✨ New Version Available',
      `Version ${updateInfo.currentVersion} is now available!\n\nNew Features:\n${updateInfo.releaseNotes.substring(0, 150)}...`,
      [
        {
          text: 'Update Later',
          onPress: () => {
            console.log('User declined update');
          },
          style: 'cancel',
        },
        {
          text: 'Update Now',
          onPress: () => {
            this.openDownloadPage(updateInfo.downloadUrl);
          },
          style: 'default',
        },
      ]
    );
  },

  /**
   * Send push notification about update
   */
  async sendUpdateNotification(updateInfo: UpdateInfo): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: updateInfo.forceUpdate ? '⚠️ Update Required' : '✨ New Version Available',
          body: `Version ${updateInfo.currentVersion} is now available!`,
          data: {
            type: 'app-update',
            version: updateInfo.currentVersion,
            downloadUrl: updateInfo.downloadUrl,
            forceUpdate: updateInfo.forceUpdate,
          },
          sound: 'default',
          badge: 1,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending update notification:', error);
    }
  },

  /**
   * Open download page or app store
   */
  openDownloadPage(url: string): void {
    Linking.openURL(url).catch((error) => {
      console.error('Error opening URL:', error);
      Alert.alert(
        'Cannot Open Link',
        'Unable to open download page. Please visit: ' + url
      );
    });
  },

  /**
   * Check for Expo OTA updates (if using Expo Updates)
   * NOTE: Requires expo-updates package to be installed
   */
  async checkExpoUpdates(): Promise<void> {
    try {
      // Expo Updates support can be added later when needed
      console.log('Expo update checking not available in current setup');
    } catch (error) {
      console.error('Error checking Expo updates:', error);
    }
  },

  /**
   * Initialize auto-update checking
   * Call this when app starts
   */
  async initializeUpdateChecks(): Promise<void> {
    try {
      console.log('Initializing update checks...');

      // Check for Expo OTA updates
      if (__DEV__) {
        console.log('Development mode - skipping Expo update check');
      } else {
        this.checkExpoUpdates();
      }

      // Check for manual app updates
      this.checkAndNotifyUpdate();

      // Setup periodic checks (every 24 hours)
      setInterval(() => {
        this.checkAndNotifyUpdate();
      }, 24 * 60 * 60 * 1000);
    } catch (error) {
      console.error('Error initializing update checks:', error);
    }
  },

  /**
   * Get current app version
   */
  getCurrentVersion(): string {
    return APP_VERSION;
  },
};
