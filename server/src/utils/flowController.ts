import { Request, Response } from "express";

/**
 * Flow Controller - Handles the platform flowchart visualization
 * This controller serves an interactive Mermaid.js flowchart showing
 * the complete workflow of the Environmental Education Platform
 */
export class FlowController {
  /**
   * Serves the interactive flowchart HTML page
   * GET /flow
   */
  static getFlowChart = (_req: Request, res: Response): void => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Environmental Education Platform - Flow Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2d3748;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5rem;
            background: linear-gradient(45deg, #48bb78, #38b2ac);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .mermaid {
            display: flex;
            justify-content: center;
            margin: 20px 0;
        }
        .info-box {
            background: #f7fafc;
            border-left: 4px solid #48bb78;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .legend {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 30px;
        }
        .legend-item {
            background: #edf2f7;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #4299e1;
        }
        .legend-title {
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 5px;
        }
        .legend-desc {
            color: #4a5568;
            font-size: 0.9rem;
        }
        .update-info {
            background: #e6fffa;
            border: 1px solid #38b2ac;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
            color: #234e52;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌱 Environmental Education Platform Flow</h1>
        
        <div class="info-box">
            <strong>Platform Overview:</strong> A gamified environmental education platform that combines theoretical learning with real-world sustainability challenges to create environmentally conscious students.
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">8</div>
                <div class="stat-label">Learning Categories</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">12</div>
                <div class="stat-label">Activity Types</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">6</div>
                <div class="stat-label">Badge Categories</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">5</div>
                <div class="stat-label">User Roles</div>
            </div>
        </div>

        <div class="mermaid">
graph TD
    A[🚪 User Registration/Login] --> B{User Role?}
    
    B --> C[👨‍🎓 Student Dashboard]
    B --> D[👨‍🏫 Teacher Dashboard]
    B --> E[👤 Admin Dashboard]
    
    C --> F[📚 Browse Lessons]
    C --> G[🏆 View Challenges]
    C --> H[📊 Check Leaderboard]
    C --> I[🎖️ View Badges & Achievements]
    
    F --> J[📖 Select Lesson Module]
    J --> K[▶️ Watch/Read Content]
    K --> L[📝 Take Quiz]
    L --> M{Quiz Passed?}
    M -->|Yes| N[✅ Earn Eco-Points]
    M -->|No| O[🔄 Retry Quiz]
    O --> L
    N --> P[📈 Update Progress]
    
    G --> Q[🎯 Join Challenge]
    Q --> R[📋 Read Instructions]
    R --> S[🌱 Perform Activity]
    S --> T[📸 Upload Proof]
    T --> U[⏳ Await Verification]
    U --> V{Verified?}
    V -->|Yes| W[🎉 Earn Challenge Points]
    V -->|No| X[❌ Resubmit]
    X --> T
    W --> Y[🏅 Check for Badges]
    
    H --> Z[👀 View Rankings]
    Z --> AA[📊 School Leaderboard]
    Z --> BB[📊 Class Leaderboard]
    Z --> CC[📊 Individual Progress]
    
    I --> DD[🎖️ Earned Badges]
    I --> EE[🏆 Unlocked Achievements]
    I --> FF[📊 Progress Stats]
    
    D --> GG[📝 Create/Manage Content]
    D --> HH[✅ Verify Student Activities]
    D --> II[📊 Monitor Class Progress]
    
    GG --> JJ[📚 Add Lessons]
    GG --> KK[❓ Create Quizzes]
    GG --> LL[🎯 Design Challenges]
    
    HH --> MM[👀 Review Submissions]
    MM --> NN{Approve/Reject}
    NN -->|Approve| OO[✅ Award Points]
    NN -->|Reject| PP[💬 Provide Feedback]
    
    E --> QQ[🏫 Manage Institutions]
    E --> RR[👥 Manage Users]
    E --> SS[📊 System Analytics]
    E --> TT[⚙️ Platform Settings]
    
    P --> UU[🔄 Check Level Up]
    W --> UU
    UU --> VV{Level Increased?}
    VV -->|Yes| WW[🎊 Level Up Notification]
    VV -->|No| XX[Continue Learning]
    
    Y --> YY{Badge Criteria Met?}
    YY -->|Yes| ZZ[🎖️ Award New Badge]
    YY -->|No| AAA[Continue Activities]
    
    WW --> BBB[🔔 Send Notification]
    ZZ --> BBB
    OO --> BBB
    BBB --> CCC[📱 Update Dashboard]
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff3e0
    style N fill:#c8e6c9
    style W fill:#c8e6c9
    style WW fill:#ffd54f
    style ZZ fill:#ffab91
        </div>

        <div class="legend">
            <div class="legend-item">
                <div class="legend-title">🚪 Authentication</div>
                <div class="legend-desc">Secure login/registration with role-based access (Student, Teacher, Admin)</div>
            </div>
            <div class="legend-item">
                <div class="legend-title">📚 Learning System</div>
                <div class="legend-desc">Interactive lessons with quizzes, progress tracking, and eco-points rewards</div>
            </div>
            <div class="legend-item">
                <div class="legend-title">🎯 Challenge System</div>
                <div class="legend-desc">Real-world environmental activities with proof submission and verification</div>
            </div>
            <div class="legend-item">
                <div class="legend-title">🏆 Gamification</div>
                <div class="legend-desc">Badges, achievements, levels, streaks, and competitive leaderboards</div>
            </div>
            <div class="legend-item">
                <div class="legend-title">👨‍🏫 Teacher Tools</div>
                <div class="legend-desc">Content management, activity verification, and progress monitoring</div>
            </div>
            <div class="legend-item">
                <div class="legend-title">👤 Admin Panel</div>
                <div class="legend-desc">Institution management, user administration, and system analytics</div>
            </div>
        </div>

        <div class="update-info">
            <strong>🔄 Living Document:</strong> This flowchart will be updated as we add new features and refine the platform. 
            Visit <code>/flow</code> anytime to see the latest version!
            <br><br>
            <strong>Last Updated:</strong> ${new Date().toLocaleDateString()} | 
            <strong>Version:</strong> 1.0.0 | 
            <strong>Environment:</strong> ${
              process.env.NODE_ENV || "development"
            }
        </div>
    </div>

    <script>
        mermaid.initialize({ 
            startOnLoad: true,
            theme: 'forest',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            }
        });
    </script>
</body>
</html>`;

    res.send(htmlContent);
  };

  /**
   * Returns flowchart data in JSON format for API consumption
   * GET /flow/data
   */
  static getFlowData = (_req: Request, res: Response): void => {
    const flowData = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      platform: {
        name: "Environmental Education Platform",
        description:
          "A gamified platform for environmental learning and sustainability challenges",
        features: [
          "Interactive Lessons",
          "Real-world Challenges",
          "Gamification System",
          "Progress Tracking",
          "Teacher Management",
          "Admin Analytics",
        ],
      },
      statistics: {
        learningCategories: 8,
        activityTypes: 12,
        badgeCategories: 6,
        userRoles: 5,
      },
      userJourneys: {
        student: [
          "Registration/Login",
          "Browse Lessons",
          "Complete Quizzes",
          "Join Challenges",
          "Upload Proof",
          "Earn Points & Badges",
          "View Leaderboards",
        ],
        teacher: [
          "Registration/Login",
          "Create Content",
          "Verify Activities",
          "Monitor Progress",
          "Provide Feedback",
        ],
        admin: [
          "Registration/Login",
          "Manage Institutions",
          "Manage Users",
          "System Analytics",
          "Platform Settings",
        ],
      },
    };

    res.json(flowData);
  };
}
