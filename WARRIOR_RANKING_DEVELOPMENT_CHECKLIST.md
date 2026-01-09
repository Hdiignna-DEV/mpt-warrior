# ✅ WARRIOR RANKING SYSTEM - DEVELOPMENT CHECKLIST

**Project**: MPT Warrior Leaderboard & Ranking System  
**Start Date**: January 9, 2026  
**Estimated Duration**: 3-4 weeks  
**Team Members**: [To be assigned]

---

## 📋 PHASE 1: DATABASE & BACKEND (Week 1)

### Database Schema & Migration
- [ ] **Task 1.1**: Create/Update `users` collection schema
  - Add totalPoints, currentRank, previousRank fields
  - Add badges array
  - Add pointsBreakdown object
  - Add tier enum field
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

- [ ] **Task 1.2**: Create `leaderboard_snapshots` collection
  - Daily historical snapshots
  - Estimated Time: 1 hour
  - Assigned to: [NAME]

- [ ] **Task 1.3**: Create `point_logs` collection
  - Audit trail for all point changes
  - Estimated Time: 1 hour
  - Assigned to: [NAME]

- [ ] **Task 1.4**: Create database indexes for performance
  - Index on `totalPoints` (descending)
  - Index on `currentRank`
  - Index on `userId`
  - Estimated Time: 1 hour
  - Assigned to: [NAME]

- [ ] **Task 1.5**: Create & test migration script
  - File: `scripts/migrate-leaderboard-schema.ts`
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] All collections exist in Cosmos DB
- [ ] Indexes are created
- [ ] Migration script runs without errors
- [ ] Sample data created successfully

---

### API Endpoints - Part 1 (Core)
- [ ] **Task 1.6**: Implement `POST /api/leaderboard/recalculate/{userId}`
  - File: `src/app/api/leaderboard/recalculate/route.ts`
  - Responsibilities:
    - Accept QUIZ_COMPLETED, JOURNAL_ENTRY, COMMENT_ADDED actions
    - Calculate new points
    - Update rank
    - Return RecalculateRankingResponse
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

- [ ] **Task 1.7**: Implement `GET /api/leaderboard/user/{userId}`
  - File: `src/app/api/leaderboard/[userId]/route.ts`
  - Return detailed ranking info
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 1.8**: Enhance `GET /api/leaderboard`
  - Add filtering by period (WEEK/MONTH/ALL_TIME)
  - Add search by name
  - Add sorting options
  - Implement caching
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

- [ ] **Task 1.9**: Implement `GET /api/leaderboard/top-three`
  - Dashboard widget endpoint
  - Cache aggressively (5 min TTL)
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] All endpoints respond correctly
- [ ] Error handling implemented
- [ ] Caching works properly
- [ ] Load tests pass (< 500ms response time)

---

### Leaderboard Service Implementation
- [ ] **Task 1.10**: Implement `leaderboard-service.ts`
  - File: `src/lib/db/leaderboard-service.ts`
  - Functions to implement:
    - `calculateTotalPoints()`
    - `recalculateUserRanking()`
    - `calculateUserRank()`
    - `getLeaderboard()`
    - `getTopThree()`
    - `getUserRankingDetail()`
  - Estimated Time: 6 hours
  - Assigned to: [NAME]

- [ ] **Task 1.11**: Implement point calculation logic
  - Quiz points contribution
  - Consistency points contribution
  - Community points contribution
  - Weekly points formula
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 1.12**: Implement badge calculation logic
  - `qualifiesForConsistencyKing()`
  - `qualifiesForKnowledgeMaster()`
  - `qualifiesForCommunityChampion()`
  - `qualifiesForTopPerformer()`
  - `qualifiesForComebackWarrior()`
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] All functions implemented
- [ ] Unit tests pass (> 90% coverage)
- [ ] Database operations work correctly
- [ ] Cache invalidation works

---

### Integrations (Phase 1)
- [ ] **Task 1.13**: Integrate with Education Service
  - Hook: Call `recalculateUserRanking()` after quiz validation
  - File: `src/lib/db/education-service.ts`
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

- [ ] **Task 1.14**: Integrate with Journal Service
  - Hook: Call `recalculateUserRanking()` after journal submission
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] Quiz completion triggers point update
- [ ] Journal submission triggers point update
- [ ] Rank changes reflect in database

---

### Testing - Phase 1
- [ ] **Task 1.15**: Create unit tests for ranking utilities
  - File: `__tests__/ranking.test.ts`
  - Test all utility functions
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 1.16**: Create integration tests
  - File: `__tests__/leaderboard-integration.test.ts`
  - Test database operations
  - Test API endpoints
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] Unit test coverage > 90%
- [ ] All integration tests pass
- [ ] No console errors in tests

---

## 🎨 PHASE 2: FRONTEND COMPONENTS (Week 2)

### Leaderboard Page Components
- [ ] **Task 2.1**: Create Leaderboard Page component
  - File: `src/components/leaderboard/LeaderboardPage.tsx`
  - Responsibilities:
    - Main container
    - Search & filter UI
    - Switch between table/card views
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

- [ ] **Task 2.2**: Create Leaderboard Table component
  - File: `src/components/leaderboard/LeaderboardTable.tsx`
  - Columns: Rank, Profile, Tier, Points, Win%, Trend, Badges
  - Highlight current user row (orange glow)
  - Sortable columns
  - Desktop view only
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

- [ ] **Task 2.3**: Create Leaderboard Card component
  - File: `src/components/leaderboard/LeaderboardCard.tsx`
  - Mobile view (< 768px)
  - Compact display
  - Tap to expand details
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 2.4**: Create Podium Display component
  - File: `src/components/leaderboard/PodiumDisplay.tsx`
  - Show Top 3 with premium design
  - Gold, Silver, Bronze frames
  - Large avatars
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 2.5**: Create Search & Filter component
  - File: `src/components/leaderboard/SearchAndFilter.tsx`
  - Search by name (debounced)
  - Filter by period (WEEK/MONTH/ALL_TIME)
  - Sort options
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] Page loads and displays data
- [ ] All interactive elements work
- [ ] Mobile responsive (tested on multiple devices)
- [ ] Performance: < 2s load time

---

### Badge & Rank Components
- [ ] **Task 2.6**: Create RankBadge component
  - File: `src/components/RankBadge.tsx`
  - Display tier with icon
  - Support different sizes (sm, md, lg)
  - Show/hide label
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

- [ ] **Task 2.7**: Create AchievementBadges component
  - File: `src/components/AchievementBadges.tsx`
  - Display achievement badges
  - Tooltip on hover
  - Responsive layout
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

- [ ] **Task 2.8**: Create TierDisplay component
  - File: `src/components/TierDisplay.tsx`
  - Show tier with details
  - Points until next tier
  - Color-coded display
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] All badge types display correctly
- [ ] Responsive on mobile
- [ ] Tooltips work
- [ ] No accessibility issues

---

### Dashboard Widget
- [ ] **Task 2.9**: Create Dashboard Leaderboard Widget
  - File: `src/components/dashboard/LeaderboardWidget.tsx`
  - Display Top 3 avatars
  - Show current user's rank
  - "View All" button
  - Auto-refresh every 30s
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 2.10**: Integrate widget into Dashboard
  - Add to dashboard page layout
  - Position on right side or below P&L
  - Estimated Time: 1 hour
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] Widget displays correctly
- [ ] Auto-refresh works
- [ ] Button navigation works
- [ ] Mobile responsive

---

### Arka Celebration Component
- [ ] **Task 2.11**: Create ArkaCelebration component
  - File: `src/components/arka/ArkaCelebration.tsx`
  - Responsibilities:
    - Display victory.png animation
    - Show congratulations message
    - Display rank info
    - Auto-close or manual close button
    - Framer Motion animations
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 2.12**: Integrate into main layout
  - Add to root layout or dashboard
  - Trigger on rank achievement
  - Only show once per day
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] Animation smooth
- [ ] Message displays correctly
- [ ] Shows only when appropriate
- [ ] No performance impact

---

### Sidebar Navigation Update
- [ ] **Task 2.13**: Add "Warrior Ranking" menu item
  - Add to sidebar navigation config
  - Icon: Trophy or Medal
  - Route: `/app/leaderboard`
  - Position: After Dashboard, Before Modules
  - Estimated Time: 1 hour
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] Menu item visible
- [ ] Navigation works
- [ ] Page loads correctly

---

## 🔗 PHASE 3: REAL-TIME & INTEGRATION (Week 2-3)

### Real-Time Update System
- [ ] **Task 3.1**: Implement Server-Sent Events (SSE)
  - File: `src/app/api/leaderboard/stream/route.ts`
  - Push updates to connected clients
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

  OR

  - [ ] **Task 3.1 (Alt)**: Implement WebSocket
    - More reliable for frequent updates
    - Estimated Time: 5 hours
    - Assigned to: [NAME]

- [ ] **Task 3.2**: Create real-time update hook
  - File: `src/hooks/useLeaderboardLive.ts`
  - Connect to SSE/WebSocket
  - Auto-update component state
  - Handle reconnection
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 3.3**: Implement polling fallback
  - File: `src/hooks/useLeaderboardPolling.ts`
  - 30-second interval
  - Fallback if SSE unavailable
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] Real-time updates work
- [ ] Fallback works
- [ ] No memory leaks
- [ ] Handles disconnection gracefully

---

### Comment/Discussion Integration
- [ ] **Task 3.4**: Integrate with comment posting
  - Hook comment creation
  - Trigger point recalculation if qualified
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

- [ ] **Task 3.5**: Filter spam/short comments
  - Only count comments ≥ 10 characters
  - Estimated Time: 1 hour
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] Comments trigger point updates
- [ ] Spam filtered correctly
- [ ] No double-counting

---

### Cron Job Setup
- [ ] **Task 3.6**: Setup daily batch recalculation
  - File: `src/app/api/cron/leaderboard-recalculate/route.ts`
  - Runs daily at 2 AM UTC
  - Recalculate all users
  - Generate snapshot
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 3.7**: Configure in vercel.json
  - Add cron job configuration
  - Set schedule
  - Estimated Time: 30 minutes
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] Cron job defined
- [ ] Runs at scheduled time
- [ ] Completes successfully
- [ ] Logs visible

---

## 📱 PHASE 4: MOBILE RESPONSIVENESS (Week 3)

### Responsive Design Testing
- [ ] **Task 4.1**: Test on mobile devices
  - iPhone 12/13/14
  - Samsung Galaxy S21/S22
  - iPad
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 4.2**: Fix mobile layout issues
  - Card view working
  - No horizontal scrolling
  - Touch-friendly buttons (44px min)
  - Text readable
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

- [ ] **Task 4.3**: Optimize for slow networks
  - Lazy load images
  - Compress data
  - Progressive rendering
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] All devices display correctly
- [ ] No layout issues
- [ ] Touch interactions work
- [ ] Performance acceptable on 3G

---

### Progressive Web App (PWA) Enhancements
- [ ] **Task 4.4**: Cache leaderboard page
  - Service worker caching
  - Offline fallback
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] Page loads offline (cached)
- [ ] Service worker working
- [ ] Cache updates properly

---

## ✅ PHASE 5: TESTING (Week 3-4)

### Unit Testing
- [ ] **Task 5.1**: Complete unit test suite
  - File: `__tests__/ranking.test.ts`
  - Coverage: > 95%
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

- [ ] **Task 5.2**: Complete service tests
  - File: `__tests__/leaderboard-service.test.ts`
  - Coverage: > 90%
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] All tests pass
- [ ] Coverage > 90%
- [ ] No flaky tests

---

### Integration Testing
- [ ] **Task 5.3**: API endpoint tests
  - File: `__tests__/api/leaderboard.test.ts`
  - Test all endpoints
  - Error scenarios
  - Estimated Time: 4 hours
  - Assigned to: [NAME]

- [ ] **Task 5.4**: Database transaction tests
  - Concurrent updates
  - Point accuracy
  - Rank calculation
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] All integration tests pass
- [ ] No data integrity issues
- [ ] Concurrent operations work

---

### E2E Testing
- [ ] **Task 5.5**: Create E2E test suite
  - File: `e2e/leaderboard.spec.ts`
  - Login flow
  - Leaderboard navigation
  - Search & filter
  - Mobile responsive
  - Estimated Time: 5 hours
  - Assigned to: [NAME]

- [ ] **Task 5.6**: Performance testing
  - Load testing (1000 concurrent users)
  - Page load time < 2s
  - API response time < 500ms
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] All E2E tests pass
- [ ] Performance meets targets
- [ ] No memory leaks
- [ ] Scalability confirmed

---

### Manual Testing Checklist
- [ ] **Quiz Completion Flow**
  - [ ] Admin validates quiz
  - [ ] Points update immediately
  - [ ] Rank changes
  - [ ] Leaderboard refreshes
  - Assigned to: [NAME]

- [ ] **Journal Entry Flow**
  - [ ] User submits journal
  - [ ] Consistency points update
  - [ ] Badge check (Consistency King)
  - [ ] Leaderboard refreshes
  - Assigned to: [NAME]

- [ ] **Comment Posting Flow**
  - [ ] User posts comment (≥10 chars)
  - [ ] Community points update
  - [ ] Badge check (Community Champion)
  - [ ] Leaderboard refreshes
  - Assigned to: [NAME]

- [ ] **Top 10 Achievement**
  - [ ] User reaches rank 10
  - [ ] Arka celebration shows
  - [ ] Animation plays correctly
  - [ ] Message displays
  - Assigned to: [NAME]

- [ ] **Mobile Experience**
  - [ ] Card view displays correctly
  - [ ] No horizontal scrolling
  - [ ] Buttons are touch-friendly
  - [ ] Performance acceptable
  - Assigned to: [NAME]

- [ ] **Real-time Updates**
  - [ ] Leaderboard refreshes automatically
  - [ ] Updates within 5 seconds
  - [ ] Multiple devices sync
  - [ ] No flicker/jumping
  - Assigned to: [NAME]

**COMPLETION CRITERIA**:
- [ ] All flows work as expected
- [ ] No bugs found
- [ ] User experience smooth
- [ ] Performance acceptable

---

## 🚀 PHASE 6: DEPLOYMENT (Week 4)

### Pre-Deployment
- [ ] **Task 6.1**: Environment setup
  - [ ] Set NEXT_PUBLIC_LEADERBOARD_REFRESH_INTERVAL in Vercel
  - [ ] Set LEADERBOARD_CACHE_TTL
  - [ ] Set database connection strings
  - [ ] Verify all env vars
  - Estimated Time: 1 hour
  - Assigned to: [NAME]

- [ ] **Task 6.2**: Database backup
  - [ ] Backup current user data
  - [ ] Backup existing leaderboard data
  - [ ] Document backup location
  - Estimated Time: 1 hour
  - Assigned to: [NAME]

- [ ] **Task 6.3**: Code review
  - [ ] Full code review by lead
  - [ ] Security review
  - [ ] Performance review
  - [ ] Document any issues
  - Estimated Time: 3 hours
  - Assigned to: [Lead]

**COMPLETION CRITERIA**:
- [ ] All environment variables set
- [ ] Backup created
- [ ] Code review approved
- [ ] No critical issues

---

### Staging Deployment
- [ ] **Task 6.4**: Deploy to staging environment
  - [ ] Push to `staging` branch
  - [ ] Verify deployment successful
  - [ ] Run smoke tests
  - [ ] Check logs
  - Estimated Time: 1 hour
  - Assigned to: [DevOps]

- [ ] **Task 6.5**: Staging smoke tests
  - [ ] Test key flows
  - [ ] API endpoints responsive
  - [ ] Database connected
  - [ ] Cache working
  - Estimated Time: 2 hours
  - Assigned to: [QA]

**COMPLETION CRITERIA**:
- [ ] Staging deployment successful
- [ ] All smoke tests pass
- [ ] No deployment errors
- [ ] Ready for production

---

### Production Deployment
- [ ] **Task 6.6**: Deploy to production
  - [ ] Create release branch
  - [ ] Tag version (v1.0.0)
  - [ ] Push to main
  - [ ] Vercel auto-deploys
  - Estimated Time: 1 hour
  - Assigned to: [DevOps]

- [ ] **Task 6.7**: Production verification
  - [ ] Verify deployment successful
  - [ ] Check for errors
  - [ ] Monitor performance
  - [ ] Verify all endpoints work
  - Estimated Time: 2 hours
  - Assigned to: [Lead]

- [ ] **Task 6.8**: Monitor for 24 hours
  - [ ] Watch error logs
  - [ ] Monitor API performance
  - [ ] Check database metrics
  - [ ] Monitor cache hit rates
  - Estimated Time: Ongoing
  - Assigned to: [Team]

**COMPLETION CRITERIA**:
- [ ] Production deployment successful
- [ ] No critical errors
- [ ] Performance acceptable
- [ ] User feedback positive

---

### Post-Deployment
- [ ] **Task 6.9**: Create documentation
  - [ ] User guide for leaderboard
  - [ ] Admin guide for point management
  - [ ] Developer guide for maintenance
  - [ ] Troubleshooting guide
  - Estimated Time: 3 hours
  - Assigned to: [NAME]

- [ ] **Task 6.10**: Team training
  - [ ] Train support team
  - [ ] Document FAQ
  - [ ] Create video tutorial
  - [ ] Schedule Q&A session
  - Estimated Time: 2 hours
  - Assigned to: [NAME]

- [ ] **Task 6.11**: Announce to users
  - [ ] Create announcement
  - [ ] Send email notification
  - [ ] Post in-app message
  - [ ] Share on social media
  - Estimated Time: 2 hours
  - Assigned to: [Marketing]

**COMPLETION CRITERIA**:
- [ ] Documentation complete
- [ ] Team trained
- [ ] Users informed
- [ ] Support ready

---

## 📊 PROGRESS TRACKING

### Weekly Milestones
- **Week 1**: ✅ Database, APIs, Integrations
- **Week 2**: ✅ Frontend, Dashboard, Sidebar
- **Week 3**: ✅ Real-time, Mobile, Testing
- **Week 4**: ✅ Deployment, Documentation, Launch

### Burn Down Chart
```
[To be filled during development]

Week 1: [===-----] 40% complete
Week 2: [========] 80% complete
Week 3: [==========] 100% complete
Week 4: [==========] 100% (Production)
```

---

## 👥 TEAM ASSIGNMENTS

| Task | Owner | Status | Notes |
|------|-------|--------|-------|
| Database Migration | [NAME] | ⏳ Pending | Start week 1 |
| API Endpoints | [NAME] | ⏳ Pending | High priority |
| Frontend Components | [NAME] | ⏳ Pending | Can run in parallel |
| Testing | [NAME] | ⏳ Pending | Throughout project |
| Deployment | [NAME] | ⏳ Pending | Week 4 |

---

## 🎯 SUCCESS CRITERIA

✅ **Functional Requirements:**
- [ ] Leaderboard page displays Top 100 users
- [ ] Dashboard widget shows Top 3 + user rank
- [ ] Points update after quiz/journal/comment
- [ ] Rank recalculates automatically
- [ ] Badges display and update correctly
- [ ] Arka celebration shows for Top 10
- [ ] Mobile responsive design works
- [ ] Search and filter functional

✅ **Non-Functional Requirements:**
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] 99.9% uptime
- [ ] Support 10,000+ concurrent users
- [ ] Cache hit rate > 80%
- [ ] Real-time update latency < 5s

✅ **Quality Requirements:**
- [ ] Test coverage > 90%
- [ ] Zero critical bugs
- [ ] Code review approved
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Accessibility WCAG 2.1 AA

---

## 🚨 RISK & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Point calculation inaccuracy | HIGH | Extensive testing, audit trail logging |
| Real-time sync delays | MEDIUM | Polling fallback, client-side caching |
| Database performance | HIGH | Proper indexing, query optimization |
| Mobile responsiveness issues | MEDIUM | Thorough testing on multiple devices |
| Cosmos DB costs | MEDIUM | Cache aggressively, optimize queries |

---

## 📝 NOTES & COMMENTS

```
[Space for team notes during development]
```

---

## 🎉 PROJECT COMPLETION CHECKLIST

- [ ] All tasks completed
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Deployed to production
- [ ] Monitoring confirmed
- [ ] Documentation complete
- [ ] Team trained
- [ ] Users happy
- [ ] Celebrate success! 🎊

---

**Document Version**: 1.0.0  
**Last Updated**: January 9, 2026  
**Owner**: Development Team Lead  

**Questions?** Contact: [team@mptwarrior.com]
