export const classifyHealthState = (pH: number | null): string => {
    if (pH === null) return "Unknown";
    if (pH <= 6.5 || pH > 8.3) return "Abnormal";
    if (pH > 7.0 && pH <= 7.6) return "Healthy";
    if (pH > 6.5 && pH <= 6.9) return "Slight Risk";
    if (pH > 6.9 && pH <= 7.7) return "Slight Risk";
    return "Unknown";
};

export const getHealthMessage = (healthState: string): string => {
    switch (healthState) {
        case "Abnormal":
            return "High Risk (Abnormal pH): Seek medical attention and avoid further exposure.";
        case "Healthy":
            return "Low Risk (Normal pH): No immediate action is needed.";
        case "Slight Risk":
            return "Medium Risk (Mild): Monitor exposure and consider medical check-ups.";
        default:
            return "";
    }
};
