export const CUSTOM_EMAIL_VALUE = "custom" as const;

export const LOGIN_DEMO_ACCOUNTS = [
    {
        value: "director@gmail.com",
        label: "Director",
        email: "director@gmail.com",
        password: "Password123!",
    },
    {
        value: "manager@gmail.com",
        label: "Manager",
        email: "manager@gmail.com",
        password: "Password123!",
    },
    {
        value: "employee@gmail.com",
        label: "Employee",
        email: "employee@gmail.com",
        password: "Password123!",
    },
] as const;

export type LoginDemoAccountValue = (typeof LOGIN_DEMO_ACCOUNTS)[number]["value"];

export type LoginEmailSelection = LoginDemoAccountValue | typeof CUSTOM_EMAIL_VALUE;

export function isDemoAccountEmail(email: string): email is LoginDemoAccountValue {
    return LOGIN_DEMO_ACCOUNTS.some((account) => account.email === email);
}

export function getDemoAccountByEmail(email: string) {
    return LOGIN_DEMO_ACCOUNTS.find((account) => account.email === email);
}

export function getInitialEmailSelection(email: string): LoginEmailSelection {
    if (isDemoAccountEmail(email)) {
        return email;
    }

    return email ? CUSTOM_EMAIL_VALUE : LOGIN_DEMO_ACCOUNTS[0].value;
}
