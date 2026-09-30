export const funnelConfig = {
  syllabusUrl: "/downloads/nextal-academy-syllabus.pdf",

  leadCapture: {
    enabled: true,
  },

  exitIntent: {
    enabled: true,
    delayMs: 15000,
    cooldownHours: 24,
  },

  urgency: {
    batchDate: "soon",
    seatsRemaining: 5,
    showCountdown: true,
  },
};
