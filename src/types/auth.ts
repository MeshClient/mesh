
export type LoginOption = {
    login_type: 'm.login.password' | 'm.login.recaptcha' | 'm.login.sso' | 'm.login.email.identity' | 'm.login.msisdn' | 'm.login.dummy' | 'm.login.registration_token';
    provider?: string;
    icon_url?: string;
}