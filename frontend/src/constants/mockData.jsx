export const dashboardData = {
  user: {
    name: "Ankit",
  },

  hero: {
    description:
      "Ready to transform today's conversations into clear decisions, action items, and AI-powered insights.",
  },

  continueWorking: {
    title: "Product Strategy Meeting",
    lastOpened: "2 hours ago",
    summaryReady: true,
    actionItems: 12,
    decisions: 5,
  },

  recentMeetings: [
    {
      id: 1,
      title: "Product Planning",
      participants: 8,
      duration: "42 min",
      date: "Today",
      status: "Completed",
    },
    {
      id: 2,
      title: "Sprint Review",
      participants: 5,
      duration: "35 min",
      date: "Yesterday",
      status: "Processing",
    },
    {
      id: 3,
      title: "Client Discussion",
      participants: 3,
      duration: "27 min",
      date: "Monday",
      status: "Summary Ready",
    },
  ],

  aiInsights: [
    {
      id: 1,
      title: "Overall Meeting Sentiment",
      value: "Positive 😊",
      description: "87% of recent meetings had a positive tone.",
    },
    {
      id: 2,
      title: "Action Items Pending",
      value: "18",
      description: "Need your attention this week.",
    },
    {
      id: 3,
      title: "Most Discussed Topic",
      value: "Product Roadmap",
      description: "Mentioned across 12 meetings.",
    },
  ],

  upcomingMeetings: [
    {
      id: 1,
      title: "Weekly Engineering Sync",
      time: "4:00 PM",
      duration: "45 min",
      participants: 8,
    },
    {
      id: 2,
      title: "Client Demo",
      time: "6:30 PM",
      duration: "30 min",
      participants: 5,
    },
    {
      id: 3,
      title: "Product Roadmap Review",
      time: "Tomorrow • 11:00 AM",
      duration: "1 hr",
      participants: 12,
    },
  ],
};

export const meetingsData = [
  {
    id: 1,
    title: "Weekly Engineering Sync",
    date: "Today • 10:30 AM",
    duration: "45 min",
    participants: 8,
    status: "Completed",
  },
  {
    id: 2,
    title: "Client Demo",
    date: "Yesterday • 2:00 PM",
    duration: "30 min",
    participants: 5,
    status: "Processing",
  },
  {
    id: 3,
    title: "Product Roadmap Review",
    date: "Jul 28 • 11:00 AM",
    duration: "1 hr",
    participants: 12,
    status: "Summary Ready",
  },
];

export const transcriptData = [
  {
    id: 1,
    speaker: "John Doe",
    initials: "JD",
    time: "00:02:14",
    message:
      "Today we'll review sprint progress and discuss the API integration timeline before planning the next release.",
  },
  {
    id: 2,
    speaker: "Sarah Miller",
    initials: "SM",
    time: "00:04:08",
    message:
      "Backend authentication is complete. We only need final QA testing before deployment.",
  },
  {
    id: 3,
    speaker: "Alex Brown",
    initials: "AB",
    time: "00:06:35",
    message:
      "The dashboard redesign should begin next sprint after the release is complete.",
  },
];

export const actionItemsData = [
  {
    id: 1,
    title: "Complete Backend API Testing",
    assignee: "John Doe",
    dueDate: "Today",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Review Dashboard UI",
    assignee: "Sarah Miller",
    dueDate: "Tomorrow",
    priority: "Medium",
    completed: true,
  },
  {
    id: 3,
    title: "Prepare Production Deployment",
    assignee: "Alex Brown",
    dueDate: "Friday",
    priority: "High",
    completed: false,
  },
];

export const decisionsData = [
  {
    id: 1,
    title: "Release Timeline Finalized",
    description:
      "The team agreed to release the application next Friday after completing QA testing.",
    owner: "Product Team",
    timestamp: "00:21:42",
  },
  {
    id: 2,
    title: "API Version Decision",
    description:
      "API Version 2 will become the default endpoint for all future integrations.",
    owner: "Backend Team",
    timestamp: "00:34:18",
  },
  {
    id: 3,
    title: "Dashboard Redesign",
    description:
      "The dashboard redesign will begin immediately after the production release.",
    owner: "Design Team",
    timestamp: "00:47:03",
  },
];

export const analyticsData = {
  sentiment: {
    value: "Positive",
    score: "87%",
  },

  participation: {
    activeSpeaker: "John Doe",
    engagement: "78%",
  },

  words: {
    total: "4,286",
    avgPerMinute: "95",
  },

  duration: {
    meeting: "45 min",
    speaking: "39 min",
  },

  topics: ["Backend", "Authentication", "Sprint Planning", "UI Redesign"],

  confidence: "96%",
};

export const analyticsOverview = [
  {
    id: 1,
    title: "Overall Sentiment",
    value: "Positive",
    secondary: "87%",
    description: "Most participants maintained a positive tone.",
    icon: "sentiment",
  },
  {
    id: 2,
    title: "AI Confidence",
    value: "96%",
    secondary: "High Accuracy",
    description: "Generated insights are highly reliable.",
    icon: "brain",
  },
  {
    id: 3,
    title: "Meeting Duration",
    value: "45 min",
    secondary: "39 min speaking",
    description: "86% of the meeting involved active discussion.",
    icon: "clock",
  },
  {
    id: 4,
    title: "Words Spoken",
    value: "4,286",
    secondary: "95 words/min",
    description: "Healthy discussion pace throughout the meeting.",
    icon: "message",
  },
];

export const speakerParticipation = [
  {
    id: 1,
    name: "John Doe",
    percentage: 45,
    speakingTime: "20 min",
    turns: 32,
  },
  {
    id: 2,
    name: "Sarah Miller",
    percentage: 30,
    speakingTime: "14 min",
    turns: 21,
  },
  {
    id: 3,
    name: "Alex Brown",
    percentage: 25,
    speakingTime: "11 min",
    turns: 18,
  },
];

export const meetingTimeline = [
  {
    id: 1,
    title: "Meeting Started",
    time: "09:00 AM",
    duration: "00:00",
    type: "start",
  },
  {
    id: 2,
    title: "Sprint Planning",
    time: "09:12 AM",
    duration: "12:15",
    type: "topic",
  },
  {
    id: 3,
    title: "Authentication Discussion",
    time: "09:27 AM",
    duration: "27:08",
    type: "discussion",
  },
  {
    id: 4,
    title: "API Design Finalized",
    time: "09:38 AM",
    duration: "38:42",
    type: "decision",
  },
  {
    id: 5,
    title: "Release Planning",
    time: "09:50 AM",
    duration: "50:11",
    type: "planning",
  },
  {
    id: 6,
    title: "Meeting Ended",
    time: "09:58 AM",
    duration: "58:00",
    type: "end",
  },
];

export const sentimentTrend = [
  {
    time: "Start",
    sentiment: 72,
  },
  {
    time: "15 min",
    sentiment: 78,
  },
  {
    time: "30 min",
    sentiment: 84,
  },
  {
    time: "45 min",
    sentiment: 91,
  },
  {
    time: "End",
    sentiment: 87,
  },
];

export const sentimentInsight = {
  overall: "Positive",
  score: "87%",
  highestMoment: "Sprint Planning Discussion",
  lowestMoment: "Authentication Blocker Discussion",
  summary:
    "The meeting began with technical concerns, improved steadily after architecture decisions were finalized, and concluded with strong confidence around the release plan.",
};


export const topicsDiscussed = [
  {
    id: 1,
    topic: "Backend Development",
    mentions: 18,
  },
  {
    id: 2,
    topic: "Authentication",
    mentions: 14,
  },
  {
    id: 3,
    topic: "Sprint Planning",
    mentions: 11,
  },
  {
    id: 4,
    topic: "API Design",
    mentions: 10,
  },
  {
    id: 5,
    topic: "UI Improvements",
    mentions: 8,
  },
  {
    id: 6,
    topic: "Deployment",
    mentions: 7,
  },
  {
    id: 7,
    topic: "Testing",
    mentions: 5,
  },
  {
    id: 8,
    topic: "Performance",
    mentions: 4,
  },
];

export const topicInsight = {
  mostDiscussed: "Backend Development",
  mentions: 18,
  percentage: 42,
  summary:
    "Most of the meeting focused on backend architecture, authentication improvements, and sprint planning. These topics dominated the discussion and resulted in several implementation decisions.",
};


export const aiBreakdown = [
  {
    id: 1,
    label: "Transcript Accuracy",
    value: "96%",
  },
  {
    id: 2,
    label: "Summary Confidence",
    value: "High",
  },
  {
    id: 3,
    label: "Action Items",
    value: "8",
  },
  {
    id: 4,
    label: "Decisions",
    value: "5",
  },
  {
    id: 5,
    label: "Questions Detected",
    value: "23",
  },
  {
    id: 6,
    label: "Topics Identified",
    value: "12",
  },
  {
    id: 7,
    label: "Processing Time",
    value: "1m 42s",
  },
  {
    id: 8,
    label: "AI Model",
    value: "GPT-5.5 + Whisper",
  },
];

export const aiProcessingInsight = {
  title: "Analysis Completed Successfully",
  description:
    "The meeting was processed with high confidence. Transcript quality was excellent, allowing the AI to generate reliable summaries, identify action items, detect key decisions, and classify discussion topics accurately.",
};