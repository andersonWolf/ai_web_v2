class UI{
    static elements = {
        loginBtn: document.getElementById("login-button"),
        signupBtn: document.getElementById("signup-button"),
        inputEmail: document.getElementById("input-email"),
        inputPass: document.getElementById('input-pass'),
        iconEye: document.getElementById('input-icon'),
    }
    // ✅ 新增 getter 方式取得 checkbox 勾選狀態
    static get rememberMe() {
        return document.getElementById('input-check').checked;
    }
}


class App{
    constructor(){
        this.checkSession();
        this.bindEvents();
    }

    bindEvents(){
        UI.elements.loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.login();
        });

        UI.elements.signupBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.signup();
        });

        UI.elements.iconEye.addEventListener('click', () => this.togglePasswordVisibility(UI.elements.inputPass, UI.elements.iconEye));

        
    }

    // 在主頁面加上這段檢查
    async checkSession() {
        const res = await fetch(`${CONFIG.API_ENDPOINTS.sessionJWT}`, {
            credentials: "include"
        });

        if (!res.ok) {
            // window.location.href = `${CONFIG.PAGE_URLS.login}`;
            console.log("❌ Session check failed, redirecting to login page.");
        }else{
            window.location.href = `${CONFIG.PAGE_URLS.main}`;
        }
    }


    async login() {
        const email = UI.elements.inputEmail.value;
        const password = UI.elements.inputPass.value;
        const remember_me = UI.rememberMe;  // ✅ 取得 checkbox 狀態

        try {
            const response = await fetch(`${CONFIG.API_ENDPOINTS.login}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, remember_me }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert("❌ Login Failed: " + errorData.detail);
                return;
            }

            const data = await response.json();
            console.log("✅ Login success:", data);
            window.location.href = `${CONFIG.PAGE_URLS.main}`;
        } catch (error) {
            alert("❗Login error: " + error.message);
        }
    }

    async signup() {
        const email = UI.elements.inputEmail.value;
        const password = UI.elements.inputPass.value;

        try {
            const response = await fetch(`${CONFIG.API_ENDPOINTS.signup}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert("❌ Signup Failed: " + errorData.detail);
                return;
            }

            const data = await response.json();
            console.log("✅ Signup success:", data);
            alert("🎉 註冊成功，請登入！");
        } catch (error) {
            alert("❗Signup error: " + error.message);
        }
    }


    // 密碼顯示切換邏輯
    togglePasswordVisibility(input, iconEye) {
        if (input.type === 'password') {
            input.type = 'text';
            iconEye.classList.add('ri-eye-line');
            iconEye.classList.remove('ri-eye-off-line');
        } else {
            input.type = 'password';
            iconEye.classList.remove('ri-eye-line');
            iconEye.classList.add('ri-eye-off-line');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});

