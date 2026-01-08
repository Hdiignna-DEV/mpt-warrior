/**
 * Pose Detection Utility
 * Analyzes chat messages and images to determine appropriate Commander Arka pose
 */

import type { CommanderArkaPose } from '@/components/ChatUIEnhancers';

interface PoseDetectionContext {
  role: 'user' | 'assistant';
  content: string;
  hasImage?: boolean;
  model?: string;
}

/**
 * Victory keywords - when user hits TP or makes profit
 */
const VICTORY_KEYWORDS = [
  'profit',
  'untung',
  'win',
  'menang',
  'tp hit',
  'target tercapai',
  'tp tercapai',
  'take profit',
  'kemenangan',
  'sukses',
  'success',
  '+pips',
  '+profit',
  'berhasil',
  'tercapai',
  'withdrawal',
  'tarik dana'
];

/**
 * Warning keywords - when user is at risk or in danger
 */
const WARNING_KEYWORDS = [
  'loss',
  'rugi',
  'danger',
  'bahaya',
  'margin call',
  'overlot',
  'overtrade',
  'over leverage',
  'sl hit',
  'stop loss',
  'terakhir',
  'paling akhir',
  '-pips',
  '-loss',
  'error',
  'panic',
  'panik',
  'takut',
  'khawatir',
  'suspend',
  'disabled'
];

/**
 * Vision keywords - when user uploads chart or asks for analysis
 */
const VISION_KEYWORDS = [
  'chart',
  'grafik',
  'analisa',
  'analyz',
  'support',
  'resistance',
  'trend',
  'pattern',
  'candle',
  'supply',
  'demand',
  'volume',
  'snr',
  'entry',
  'exit',
  'setup',
  'signal',
  'image',
  'foto',
  'screenshot'
];

/**
 * Detect pose from message content
 * Returns the most appropriate pose based on keyword matching
 */
export function detectPoseFromContent(
  content: string,
  hasImage: boolean = false
): CommanderArkaPose {
  const text = content.toLowerCase();

  // If image was just uploaded, default to vision
  if (hasImage && content.includes('[IMAGE]')) {
    return 'vision';
  }

  // Check for victory indicators (highest priority for motivation)
  for (const keyword of VICTORY_KEYWORDS) {
    if (text.includes(keyword)) {
      return 'victory';
    }
  }

  // Check for warning indicators (high priority for risk management)
  for (const keyword of WARNING_KEYWORDS) {
    if (text.includes(keyword)) {
      return 'warning';
    }
  }

  // Check for vision/analysis indicators (medium priority)
  for (const keyword of VISION_KEYWORDS) {
    if (text.includes(keyword)) {
      return 'vision';
    }
  }

  // Default fallback
  return 'empty';
}

/**
 * Intelligent pose selection based on conversation context
 * Considers message role, content, and model type
 */
export function selectOptimalPose(
  contexts: PoseDetectionContext[],
  index: number
): CommanderArkaPose {
  const currentContext = contexts[index];
  
  // If this is a user message, infer what's coming next
  if (currentContext.role === 'user') {
    return detectPoseFromContent(currentContext.content, currentContext.hasImage);
  }

  // If this is an AI message, check the previous user message for context
  if (currentContext.role === 'assistant' && index > 0) {
    const previousUserContext = contexts.slice(0, index).reverse().find(c => c.role === 'user');
    
    if (previousUserContext) {
      const userPose = detectPoseFromContent(previousUserContext.content, previousUserContext.hasImage);
      
      // AI response should match or enhance the user's intent
      // Victory mood should be maintained
      if (userPose === 'victory') {
        return 'victory';
      }
      
      // Warning mood should be maintained
      if (userPose === 'warning') {
        return 'warning';
      }
      
      // Vision mode for analysis
      if (userPose === 'vision') {
        return 'vision';
      }
    }

    // Default assistant pose when no user context
    return 'empty';
  }

  return 'empty';
}

/**
 * Get pose based on latest message in conversation
 * Used for showing mascot pose during chat
 */
export function getPoseFromConversation(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): CommanderArkaPose {
  if (messages.length === 0) {
    return 'empty';
  }

  // Analyze last 3 messages to determine mood
  const recentMessages = messages.slice(-3);
  
  // Higher weight for recent messages
  let victoryScore = 0;
  let warningScore = 0;
  let visionScore = 0;

  recentMessages.forEach((msg, idx) => {
    const weight = idx + 1; // More recent = higher weight
    const text = msg.content.toLowerCase();

    // Victory detection
    if (VICTORY_KEYWORDS.some(keyword => text.includes(keyword))) {
      victoryScore += weight * 2; // Victory has double importance
    }

    // Warning detection
    if (WARNING_KEYWORDS.some(keyword => text.includes(keyword))) {
      warningScore += weight * 2; // Warning has double importance
    }

    // Vision detection
    if (VISION_KEYWORDS.some(keyword => text.includes(keyword))) {
      visionScore += weight;
    }
  });

  // Return the mood with highest score
  if (victoryScore >= warningScore && victoryScore >= visionScore && victoryScore > 0) {
    return 'victory';
  }

  if (warningScore >= visionScore && warningScore > 0) {
    return 'warning';
  }

  if (visionScore > 0) {
    return 'vision';
  }

  return 'empty';
}
