/* ==========================================================
   TRYCATCH75 - CENTRAL COCKPIT SCRIPT CONTROLLER (REBUILT)
========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MULTI-USER REGISTRY & STATE ENGINE
    // ==========================================
    
    // Default preloaded demo user statistics (Admin Scholar demo)
    const DEMO_USER_DATA = {
        profile: {
            name: "Admin Scholar",
            role: "Academic Cockpit Admin",
            streak: 14,
            goal: 80,
            focusMinutes: 52
        },
        subjects: [
            { id: "ds", name: "Data Structures", icon: "code", conducted: 25, attended: 21, target: 80, syllabus: 60, exam: "2026-06-05" },
            { id: "os", name: "OS & Systems", icon: "terminal", conducted: 24, attended: 19, target: 80, syllabus: 45, exam: "2026-06-12" },
            { id: "ml", name: "Machine Learning", icon: "brain", conducted: 26, attended: 23, target: 80, syllabus: 70, exam: "2026-06-18" }
        ],
        logs: [
            { id: "log-1", subjectId: "ds", subjectName: "Data Structures", status: "PRESENT", timestamp: "2026-05-28T10:30:00" },
            { id: "log-2", subjectId: "os", subjectName: "OS & Systems", status: "ABSENT", timestamp: "2026-05-27T14:00:00" },
            { id: "log-3", subjectId: "ml", subjectName: "Machine Learning", status: "PRESENT", timestamp: "2026-05-27T11:45:00" }
        ],
        tasks: [
            { id: "task-1", text: "Complete Heap Tree Assignment", subjectId: "ds", completed: true },
            { id: "task-2", text: "Read Virtual Memory Paging theory", subjectId: "os", completed: false },
            { id: "task-3", text: "Train simple linear regression model", subjectId: "ml", completed: false },
            { id: "task-4", text: "Implement BFS/DFS graphs", subjectId: "ds", completed: false }
        ],
        schedule: [
            { id: "slot-1", day: "Monday", subjectId: "ds", subjectName: "Data Structures", start: "09:00", end: "10:00" },
            { id: "slot-2", day: "Monday", subjectId: "os", subjectName: "OS & Systems", start: "10:15", end: "11:15" },
            { id: "slot-3", day: "Wednesday", subjectId: "ml", subjectName: "Machine Learning", start: "10:15", end: "11:15" },
            { id: "slot-4", day: "Wednesday", subjectId: "ds", subjectName: "Data Structures", start: "13:30", end: "14:30" },
            { id: "slot-5", day: "Friday", subjectId: "os", subjectName: "OS & Systems", start: "09:00", end: "10:00" }
        ],
        settings: { theme: "cyber", soundEnabled: true }
    };

    // Preset timetable data for Yuvraj Panchal – Sem II CSE-AIML (AM2 Batch)
    // Program: (Engineering) Computer Science Engineering-AIML (E-AIML)
    // Class Coordinator: Dr. Madhura Ranade | Semester II | Academic Year 2025-26
    const YUVRAJ_USER_DATA = {
        profile: {
            name: "Yuvraj Panchal",
            role: "Semester II • CSE-AIML (E-AIML)",
            streak: 0,
            goal: 75,
            focusMinutes: 0
        },
        subjects: [
            { id: "egm", name: "Engineering Graphics (EGM)", icon: "globe", conducted: 0, attended: 0, target: 75, syllabus: 0, exam: "" },
            { id: "pps", name: "Programming for Problem Solving (PPS)", icon: "code", conducted: 0, attended: 0, target: 75, syllabus: 0, exam: "" },
            { id: "cms", name: "Communication Skills (CMS)", icon: "book-open", conducted: 0, attended: 0, target: 75, syllabus: 0, exam: "" },
            { id: "ech", name: "Engineering Chemistry (ECH)", icon: "cpu", conducted: 0, attended: 0, target: 75, syllabus: 0, exam: "" },
            { id: "german", name: "German Language", icon: "globe", conducted: 0, attended: 0, target: 75, syllabus: 0, exam: "" },
            { id: "yoga", name: "Yoga & Wellness", icon: "brain", conducted: 0, attended: 0, target: 75, syllabus: 0, exam: "" },
            { id: "emt2", name: "Engineering Mathematics II (EMT II)", icon: "terminal", conducted: 0, attended: 0, target: 75, syllabus: 0, exam: "" },
            { id: "wsp", name: "Workshop Practice (WSP)", icon: "laptop", conducted: 0, attended: 0, target: 75, syllabus: 0, exam: "" }
        ],
        logs: [],
        tasks: [
            { id: "yp-t1", text: "Review EGM drawing conventions", subjectId: "egm", completed: false },
            { id: "yp-t2", text: "Practice C programming exercises", subjectId: "pps", completed: false },
            { id: "yp-t3", text: "Revise ECH periodic table concepts", subjectId: "ech", completed: false },
            { id: "yp-t4", text: "Complete EMT II assignment", subjectId: "emt2", completed: false }
        ],
        schedule: [
            // ========== MONDAY ==========
            { id: "yp-m1", day: "Monday", subjectId: "egm", subjectName: "Engineering Graphics (EGM)", start: "08:00", end: "10:00" },
            // 10:00-11:00 RECESS
            { id: "yp-m2", day: "Monday", subjectId: "pps", subjectName: "Programming for Problem Solving (PPS)", start: "11:00", end: "12:00" },
            { id: "yp-m3", day: "Monday", subjectId: "pps", subjectName: "PPS Practical (AM2)", start: "12:00", end: "14:00" },
            { id: "yp-m4", day: "Monday", subjectId: "ech", subjectName: "Engineering Chemistry (ECH)", start: "14:00", end: "15:00" },

            // ========== TUESDAY ==========
            { id: "yp-t5", day: "Tuesday", subjectId: "german", subjectName: "German Language", start: "09:00", end: "11:00" },
            { id: "yp-t6", day: "Tuesday", subjectId: "cms", subjectName: "Communication Skills (CMS)", start: "11:00", end: "13:00" },
            // 13:00-14:00 RECESS
            { id: "yp-t7", day: "Tuesday", subjectId: "ech", subjectName: "ECH Practical (AM2)", start: "14:00", end: "16:00" },

            // ========== WEDNESDAY ==========
            { id: "yp-w1", day: "Wednesday", subjectId: "yoga", subjectName: "Yoga Practical", start: "08:00", end: "10:00" },
            { id: "yp-w2", day: "Wednesday", subjectId: "yoga", subjectName: "Yoga & Wellness", start: "10:00", end: "11:00" },
            { id: "yp-w3", day: "Wednesday", subjectId: "pps", subjectName: "Programming for Problem Solving (PPS)", start: "11:00", end: "12:00" },
            // 12:00-13:00 RECESS
            { id: "yp-w4", day: "Wednesday", subjectId: "ech", subjectName: "Engineering Chemistry (ECH)", start: "13:00", end: "14:00" },

            // ========== THURSDAY ==========
            { id: "yp-th1", day: "Thursday", subjectId: "wsp", subjectName: "WSP Practical", start: "08:00", end: "10:00" },
            // 10:00-11:00 RECESS
            { id: "yp-th2", day: "Thursday", subjectId: "egm", subjectName: "Engineering Graphics (EGM)", start: "11:00", end: "12:00" },
            { id: "yp-th3", day: "Thursday", subjectId: "emt2", subjectName: "Engineering Mathematics II (EMT II)", start: "12:00", end: "14:00" },

            // ========== FRIDAY ==========
            { id: "yp-f1", day: "Friday", subjectId: "egm", subjectName: "EGM Practical (AM2)", start: "08:00", end: "10:00" },
            { id: "yp-f2", day: "Friday", subjectId: "cms", subjectName: "CMS Practical (AM2)", start: "10:00", end: "12:00" },
            { id: "yp-f3", day: "Friday", subjectId: "emt2", subjectName: "Engineering Mathematics II (EMT II)", start: "12:00", end: "13:00" },
            // 13:00-14:00 RECESS
            { id: "yp-f4", day: "Friday", subjectId: "ech", subjectName: "Engineering Chemistry (ECH)", start: "14:00", end: "15:00" },

            // ========== SATURDAY ==========
            { id: "yp-s1", day: "Saturday", subjectId: "wsp", subjectName: "WSP Practical (AM2)", start: "12:00", end: "14:00" },
            { id: "yp-s2", day: "Saturday", subjectId: "wsp", subjectName: "WSP Practical (AM2)", start: "14:00", end: "16:00" }
        ],
        settings: { theme: "cyber", soundEnabled: true }
    };

    // User credentials accounts list
    let tcRegistry = JSON.parse(localStorage.getItem('tc_registry')) || [
        { username: "admin", password: "admin" } // Demo account preloaded
    ];
    localStorage.setItem('tc_registry', JSON.stringify(tcRegistry));

    // Currently authenticated user session
    let tcCurrentUser = localStorage.getItem('tc_current_user') || null;

    // Active DOM Tab elements
    const tabs = document.querySelectorAll('.nav-tab');
    const views = document.querySelectorAll('.view-content');

    // Bind sidebar tabs click listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
            playSound('click');
        });
    });

    // Active sandboxed state variables loaded dynamically
    let state = {
        profile: null,
        subjects: [],
        logs: [],
        tasks: [],
        schedule: [],
        settings: { theme: "cyber", soundEnabled: true }
    };

    // Initializes user-specific isolated memory from localStorage
    function loadUserState(username) {
        tcCurrentUser = username;
        localStorage.setItem('tc_current_user', username);

        // Preload demo user datasets for admin account (force update if old data is cached)
        const cachedState = localStorage.getItem(`tc_state_${username}`);
        if (username === "admin") {
            try {
                if (!cachedState || JSON.parse(cachedState).profile.name === "Alex Chen") {
                    localStorage.setItem(`tc_state_${username}`, JSON.stringify(DEMO_USER_DATA));
                }
            } catch(e) {
                localStorage.setItem(`tc_state_${username}`, JSON.stringify(DEMO_USER_DATA));
            }
        }

        // Preload Yuvraj Panchal's Sem II CSE-AIML timetable (AM2 batch)
        if (username.toLowerCase() === "yuvraj panchal") {
            try {
                const cached = cachedState ? JSON.parse(cachedState) : null;
                // Inject timetable if no schedule exists or subjects don't match preset
                const hasPresetSubjects = cached && cached.subjects && cached.subjects.some(s => s.id === "egm");
                if (!cached || !hasPresetSubjects) {
                    // Preserve user settings if they exist, merge with preset data
                    const merged = JSON.parse(JSON.stringify(YUVRAJ_USER_DATA));
                    if (cached && cached.settings) merged.settings = cached.settings;
                    localStorage.setItem(`tc_state_${username}`, JSON.stringify(merged));
                }
            } catch(e) {
                localStorage.setItem(`tc_state_${username}`, JSON.stringify(YUVRAJ_USER_DATA));
            }
        }

        const rawData = localStorage.getItem(`tc_state_${username}`);
        if (rawData) {
            state = JSON.parse(rawData);
        } else {
            // Brand new user fresh slate template
            state = {
                profile: { name: username, role: "Student", goal: 75, streak: 0, focusMinutes: 0 },
                subjects: [],
                logs: [],
                tasks: [],
                schedule: [],
                settings: { theme: "cyber", soundEnabled: true }
            };
        }
    }

    // Persists the active user's sandboxed datasets
    function saveState() {
        if (!tcCurrentUser) return;
        localStorage.setItem(`tc_state_${tcCurrentUser}`, JSON.stringify(state));
    }

    // ==========================================
    // 2. SYNTHESIZED WEB AUDIO SOUND CHIME ENGINE
    // ==========================================
    let audioCtx = null;

    function playSound(type) {
        if (state.settings && state.settings.soundEnabled === false) return;
        
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            const now = audioCtx.currentTime;

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            } 
            else if (type === 'success') {
                const notes = [261.63, 329.63, 392.00, 523.25];
                notes.forEach((freq, idx) => {
                    const oscNode = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    oscNode.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    oscNode.type = 'triangle';
                    oscNode.frequency.setValueAtTime(freq, now + (idx * 0.08));
                    gainNode.gain.setValueAtTime(0, now);
                    gainNode.gain.linearRampToValueAtTime(0.1, now + (idx * 0.08) + 0.02);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.08) + 0.22);
                    oscNode.start(now + (idx * 0.08));
                    oscNode.stop(now + (idx * 0.08) + 0.25);
                });
            } 
            else if (type === 'alert') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.linearRampToValueAtTime(160, now + 0.3);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } 
            else if (type === 'complete') {
                const times = [0, 0.2];
                times.forEach((t) => {
                    const osc1 = audioCtx.createOscillator();
                    const osc2 = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    osc1.connect(gainNode);
                    osc2.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(880, now + t);
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(1109.73, now + t);
                    gainNode.gain.setValueAtTime(0, now + t);
                    gainNode.gain.linearRampToValueAtTime(0.08, now + t + 0.02);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + t + 0.6);
                    osc1.start(now + t);
                    osc1.stop(now + t + 0.6);
                    osc2.start(now + t);
                    osc2.stop(now + t + 0.6);
                });
            }
        } catch (e) {
            console.warn("Audio Context sound blocked: ", e);
        }
    }

    // ==========================================
    // 3. TOAST SYSTEM NOTIFICATIONS
    // ==========================================
    const toastContainer = document.getElementById('toast-container');

    function addToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-item ${type}`;
        
        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle';
        if (type === 'error') iconName = 'alert-triangle';

        toast.innerHTML = `
            <div class="toast-icon ${type}">
                <i data-lucide="${iconName}"></i>
            </div>
            <div class="toast-msg">${msg}</div>
        `;
        toastContainer.appendChild(toast);
        lucide.createIcons();

        if (type === 'success') playSound('success');
        else if (type === 'error') playSound('alert');
        else playSound('click');

        setTimeout(() => {
            toast.classList.add('exit');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    // ==========================================
    // 4. CREDENTIALS VALIDATIONS & GATEWAY TABS
    // ==========================================
    const loginScreen = document.getElementById('login-screen');
    const appWorkspace = document.getElementById('app-workspace');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Panels and Toggles matching index.html
    const panelSigninView = document.getElementById('panel-signin-view');
    const panelRegisterView = document.getElementById('panel-register-view');
    const btnShowRequestAccess = document.getElementById('btn-show-request-access');
    const btnShowSignin = document.getElementById('btn-show-signin');

    // Panel Transition Handlers (Request Access <-> Sign In)
    if (btnShowRequestAccess) {
        btnShowRequestAccess.addEventListener('click', (e) => {
            e.preventDefault();
            panelSigninView.classList.remove('active');
            panelRegisterView.classList.add('active');
            playSound('click');
        });
    }

    if (btnShowSignin) {
        btnShowSignin.addEventListener('click', (e) => {
            e.preventDefault();
            panelRegisterView.classList.remove('active');
            panelSigninView.classList.add('active');
            playSound('click');
        });
    }

    // Password Visibility Eye Toggles
    const btnTogglePasswordView = document.getElementById('btn-toggle-password-view');
    const loginPasswordInput = document.getElementById('login-password');
    const passwordEyeIcon = document.getElementById('password-eye-icon');

    if (btnTogglePasswordView && loginPasswordInput && passwordEyeIcon) {
        btnTogglePasswordView.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginPasswordInput.type === 'password') {
                loginPasswordInput.type = 'text';
                passwordEyeIcon.setAttribute('data-lucide', 'eye-off');
            } else {
                loginPasswordInput.type = 'password';
                passwordEyeIcon.setAttribute('data-lucide', 'eye');
            }
            lucide.createIcons();
            playSound('click');
        });
    }

    const btnToggleRegisterPass = document.getElementById('btn-toggle-register-pass');
    const registerPasswordInput = document.getElementById('register-password');
    const registerEyeIcon = document.getElementById('register-eye-icon');

    if (btnToggleRegisterPass && registerPasswordInput && registerEyeIcon) {
        btnToggleRegisterPass.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerPasswordInput.type === 'password') {
                registerPasswordInput.type = 'text';
                registerEyeIcon.setAttribute('data-lucide', 'eye-off');
            } else {
                registerPasswordInput.type = 'password';
                registerEyeIcon.setAttribute('data-lucide', 'eye');
            }
            lucide.createIcons();
            playSound('click');
        });
    }

    // Local Forgot Password Recovery Action
    const btnForgotPassword = document.getElementById('btn-forgot-password');
    if (btnForgotPassword) {
        btnForgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('login-username').value.trim();
            if (!usernameInput) {
                addToast("Please fill in your Student ID or Email field first.", "error");
                return;
            }
            
            const matchedUser = tcRegistry.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());
            if (matchedUser) {
                addToast(`Credentials Found! Password for ${matchedUser.username} is: "${matchedUser.password}"`, "success");
            } else {
                addToast(`No registered cockpit found for "${usernameInput}".`, "error");
            }
        });
    }

    // Form: Access Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value;

        const matchedUser = tcRegistry.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === pass);

        if (matchedUser) {
            // Load and authenticate
            loadUserState(matchedUser.username);
            
            // Apply visual aesthetic settings immediately
            document.body.className = `theme-${state.settings.theme || 'cyber'}`;
            
            // Animate transition reveal
            loginScreen.style.display = 'none';
            appWorkspace.style.display = 'flex';
            
            addToast(`Welcome back, ${state.profile.name || username}!`, 'success');
            
            // Check if account has zero subjects to launch onboarding
            if (state.subjects.length === 0) {
                launchOnboardingWizard();
            } else {
                renderDashboard();
            }
            
            // Reset input values
            loginForm.reset();
        } else {
            addToast("Invalid credentials combination. Try admin/admin.", 'error');
        }
    });

    // Form: Create Register Account
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value.trim();
        const pass = document.getElementById('register-password').value;

        if (username.length < 3 || pass.length < 3) {
            addToast("Credentials must contain at least 3 characters.", 'error');
            return;
        }

        const usernameTaken = tcRegistry.some(u => u.username.toLowerCase() === username.toLowerCase());

        if (usernameTaken) {
            addToast("Username already exists in cockpit registry.", 'error');
        } else {
            // Register into cockpit system
            tcRegistry.push({ username, password: pass });
            localStorage.setItem('tc_registry', JSON.stringify(tcRegistry));

            // Load new isolated state
            loadUserState(username);
            saveState();

            // Reveal workspace
            loginScreen.style.display = 'none';
            appWorkspace.style.display = 'flex';
            
            addToast(`Account initialized! Welcome, ${username}!`, 'success');
            
            // Launch onboarding only if no preset subjects were loaded
            if (state.subjects.length === 0) {
                launchOnboardingWizard();
            } else {
                renderDashboard();
            }
            
            registerForm.reset();
        }
    });

    // Sign Out trigger functions
    function executeSignOut() {
        // Clear active session identifiers
        tcCurrentUser = null;
        localStorage.removeItem('tc_current_user');
        
        // Stop Pomodoro ticking
        if (pomodoroInterval) {
            clearInterval(pomodoroInterval);
            isTimerRunning = false;
            timerBtn.textContent = "Start Session";
            timerBtn.classList.remove('active');
        }

        // Swap overlay displays
        appWorkspace.style.display = 'none';
        loginScreen.style.display = 'flex';
        
        playSound('alert');
        addToast("Signed out of session safely.");
    }

    document.getElementById('btn-header-signout').addEventListener('click', executeSignOut);
    document.getElementById('btn-profile-signout').addEventListener('click', executeSignOut);

    // ==========================================
    // 5. FIRST-TIME USER SETUP ONBOARDING WIZARD
    // ==========================================
    const modalOnboarding = document.getElementById('modal-onboarding');
    const obSlides = document.querySelectorAll('.onboarding-slide');
    const obDots = document.querySelectorAll('.ob-dot');
    const obStepsText = document.getElementById('onboarding-steps-text');
    let onboardingCurrentStep = 1;
    let tempSubjects = []; // Holds list parsed from bulk text

    function launchOnboardingWizard() {
        // Pre-render fresh dashboard metrics with user's ID
        renderDashboard();

        onboardingCurrentStep = 1;
        tempSubjects = [];
        
        // Reset Inputs
        document.getElementById('ob-profile-name').value = '';
        document.getElementById('ob-profile-role').value = '';
        document.getElementById('ob-profile-goal').value = '75';
        document.getElementById('ob-subjects-bulk').value = '';
        
        renderOnboardingSlide();
        modalOnboarding.classList.add('active');
        playSound('success');
    }

    function renderOnboardingSlide() {
        obSlides.forEach(s => s.classList.remove('active'));
        obDots.forEach(d => d.classList.remove('active'));

        document.getElementById(`onboarding-slide-${onboardingCurrentStep}`).classList.add('active');
        document.querySelectorAll('.ob-dot')[onboardingCurrentStep - 1].classList.add('active');
        obStepsText.textContent = `Step ${onboardingCurrentStep} of 3`;
    }

    // Action Onboarding Slide 1 -> 2
    document.getElementById('ob-btn-go-2').addEventListener('click', () => {
        const name = document.getElementById('ob-profile-name').value.trim();
        const role = document.getElementById('ob-profile-role').value.trim();
        const goal = parseInt(document.getElementById('ob-profile-goal').value);

        if (!name || !role || isNaN(goal)) {
            addToast("Please fill in all profile fields to customize your setup.", 'error');
            return;
        }

        state.profile.name = name;
        state.profile.role = role;
        state.profile.goal = goal;
        
        onboardingCurrentStep = 2;
        renderOnboardingSlide();
        playSound('click');
    });

    // Action Onboarding Slide 2 -> 3
    document.getElementById('ob-btn-go-3').addEventListener('click', () => {
        const bulkText = document.getElementById('ob-subjects-bulk').value.trim();

        if (!bulkText) {
            addToast("Please input at least one subject to continue setup.", 'error');
            return;
        }

        // Parse comma-separated text into separate course blocks
        const listNames = bulkText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        if (listNames.length === 0) {
            addToast("Please fill in course names separated by commas.", 'error');
            return;
        }

        // Map icons dynamically
        const iconsSequence = ['code', 'terminal', 'brain', 'laptop', 'book-open', 'cpu', 'database', 'globe'];
        tempSubjects = listNames.map((name, index) => {
            return {
                id: `sub-${Date.now()}-${index}`,
                name: name,
                icon: iconsSequence[index % iconsSequence.length],
                conducted: 0,
                attended: 0,
                target: state.profile.goal,
                syllabus: 0,
                exam: ""
            };
        });

        // Populate attendance initializer rows inside step 3
        const slidersList = document.getElementById('ob-subject-sliders-list');
        slidersList.innerHTML = '';

        tempSubjects.forEach((sub, idx) => {
            const row = document.createElement('div');
            row.className = "ob-init-subject-row";
            row.innerHTML = `
                <div class="ob-init-subject-title">${sub.name}</div>
                <div class="ob-init-sliders-row-inputs">
                    <div class="calc-input-group">
                        <label>Classes Conducted</label>
                        <input type="number" class="form-input ob-init-cond" data-idx="${idx}" min="0" value="0" style="padding:6px 10px; font-size:12px;">
                    </div>
                    <div class="calc-input-group">
                        <label>Classes Attended</label>
                        <input type="number" class="form-input ob-init-att" data-idx="${idx}" min="0" value="0" style="padding:6px 10px; font-size:12px;">
                    </div>
                </div>
            `;
            slidersList.appendChild(row);
        });

        onboardingCurrentStep = 3;
        renderOnboardingSlide();
        playSound('click');
    });

    // Onboarding Back buttons
    document.getElementById('ob-btn-back-1').addEventListener('click', () => {
        onboardingCurrentStep = 1;
        renderOnboardingSlide();
        playSound('click');
    });

    document.getElementById('ob-btn-back-2').addEventListener('click', () => {
        onboardingCurrentStep = 2;
        renderOnboardingSlide();
        playSound('click');
    });

    // Onboarding Finish Slide 3
    document.getElementById('ob-btn-finish').addEventListener('click', () => {
        let hasError = false;

        // Collect initial conducted / attended numbers
        const condInputs = document.querySelectorAll('.ob-init-cond');
        const attInputs = document.querySelectorAll('.ob-init-att');

        condInputs.forEach(input => {
            const idx = parseInt(input.getAttribute('data-idx'));
            const conducted = parseInt(input.value) || 0;
            const attended = parseInt(attInputs[idx].value) || 0;

            if (attended > conducted) {
                addToast(`For ${tempSubjects[idx].name}, attended classes cannot exceed conducted!`, 'error');
                hasError = true;
                return;
            }

            tempSubjects[idx].conducted = conducted;
            tempSubjects[idx].attended = attended;
        });

        if (hasError) return;

        // Apply newly configured settings
        state.subjects = tempSubjects;
        state.logs = [];
        state.tasks = [];
        state.schedule = [];
        
        // Add default checklist items for fun based on courses
        state.subjects.forEach((sub, idx) => {
            state.tasks.push({
                id: `task-ob-${idx}`,
                text: `Review syllabus of ${sub.name}`,
                subjectId: sub.id,
                completed: false
            });
        });

        saveState();
        modalOnboarding.classList.remove('active');
        playSound('complete');
        addToast("Cockpit configuration loaded successfully!", 'success');
        
        // Load main page
        switchTab('dashboard');
        renderDashboard();
    });


    // ==========================================
    // 6. DETAILED ATTENDANCE CALCULATIONS MATH
    // ==========================================
    function calculateSubjectMetrics(sub) {
        if (sub.conducted === 0) {
            return {
                percentage: 100,
                status: 'SAFE',
                bunkAllowance: 0,
                colorClass: 'safe'
            };
        }

        const percentage = Math.round((sub.attended / sub.conducted) * 1000) / 10;
        
        let status = 'SAFE';
        let colorClass = 'safe';
        let bunkAllowance = 0;

        if (percentage < sub.target) {
            const targetFrac = sub.target / 100;
            const required = Math.ceil((targetFrac * sub.conducted - sub.attended) / (1 - targetFrac));
            bunkAllowance = -required;
            status = 'DANGER';
            colorClass = 'danger';
        } else {
            const targetFrac = sub.target / 100;
            const maxConducted = Math.floor(sub.attended / targetFrac);
            bunkAllowance = Math.max(0, maxConducted - sub.conducted);
            
            if (percentage - sub.target < 3) {
                status = 'WARNING';
                colorClass = 'warning';
            }
        }

        return { percentage, status, bunkAllowance, colorClass };
    }

    function calculateOverallMetrics(simulatedAbsences = 0) {
        let totalConducted = 0;
        let totalAttended = 0;

        state.subjects.forEach(sub => {
            totalConducted += sub.conducted;
            totalAttended += sub.attended;
        });

        totalConducted += simulatedAbsences;

        if (totalConducted === 0) {
            return {
                percentage: 100,
                status: 'SAFE',
                bunkCapacity: 0,
                colorClass: 'safe'
            };
        }

        const percentage = Math.round((totalAttended / totalConducted) * 1000) / 10;
        const targetGoal = state.profile.goal;
        
        let status = 'SAFE';
        let colorClass = 'safe';
        let bunkCapacity = 0;

        if (percentage < targetGoal) {
            const targetFrac = targetGoal / 100;
            const required = Math.ceil((targetFrac * totalConducted - totalAttended) / (1 - targetFrac));
            bunkCapacity = -required;
            status = 'DANGER';
            colorClass = 'danger';
        } else {
            const targetFrac = targetGoal / 100;
            const maxConducted = Math.floor(totalAttended / targetFrac);
            bunkCapacity = Math.max(0, maxConducted - totalConducted);
            
            if (percentage - targetGoal < 3) {
                status = 'WARNING';
                colorClass = 'warning';
            }
        }

        return { percentage, status, bunkCapacity, colorClass };
    }

    // ==========================================
    // 7. RENDER LOGIC: DASHBOARD
    // ==========================================
    const overallGauge = document.getElementById('overall-gauge-bar');
    const overallPercentText = document.getElementById('overall-percentage-value');
    const dashboardStatusBox = document.getElementById('dashboard-status-box');
    const dashboardStatusValue = document.getElementById('dashboard-status-value');
    const dashboardBunkCapacity = document.getElementById('dashboard-bunk-capacity');

    function renderDashboard() {
        if (!tcCurrentUser) return;

        const metrics = calculateOverallMetrics();
        
        // Progress Gauge stroke logic
        const circumference = 264;
        const offset = circumference - (metrics.percentage / 100) * circumference;
        overallGauge.style.strokeDashoffset = offset;
        overallPercentText.textContent = `${metrics.percentage}%`;

        // Update gauges color based on status
        if (metrics.colorClass === 'safe') {
            overallGauge.style.stroke = 'var(--accent-primary)';
            overallGauge.style.filter = 'drop-shadow(0 0 8px rgba(0, 230, 118, 0.6))';
        } else if (metrics.colorClass === 'warning') {
            overallGauge.style.stroke = 'var(--accent-warning)';
            overallGauge.style.filter = 'drop-shadow(0 0 8px rgba(255, 179, 0, 0.6))';
        } else {
            overallGauge.style.stroke = 'var(--accent-danger)';
            overallGauge.style.filter = 'drop-shadow(0 0 8px rgba(255, 23, 68, 0.6))';
        }

        // Command Center Footer Panels
        dashboardStatusBox.className = `command-subcard status-box ${metrics.colorClass}-state`;
        let statusIcon = 'check-circle';
        if (metrics.colorClass === 'warning') statusIcon = 'alert-circle';
        if (metrics.colorClass === 'danger') statusIcon = 'x-circle';

        dashboardStatusValue.innerHTML = `<i data-lucide="${statusIcon}"></i> ${metrics.status}`;
        
        if (metrics.bunkCapacity >= 0) {
            dashboardBunkCapacity.textContent = `${metrics.bunkCapacity} Classes`;
            dashboardBunkCapacity.className = "box-value font-mono text-glow-green";
            if (metrics.colorClass === 'warning') {
                dashboardBunkCapacity.className = "box-value font-mono text-glow-orange";
            }
            document.getElementById('dashboard-capacity-box').querySelector('.box-label').textContent = "Bunk Capacity";
        } else {
            dashboardBunkCapacity.textContent = `${Math.abs(metrics.bunkCapacity)} Classes`;
            dashboardBunkCapacity.className = "box-value font-mono danger-state";
            document.getElementById('dashboard-capacity-box').querySelector('.box-label').textContent = "Required Classes";
        }

        // Profile details
        const userName = state.profile.name || tcCurrentUser;
        const userRole = state.profile.role || "Student";
        document.getElementById('banner-user-name').textContent = userName;
        document.getElementById('banner-user-role').textContent = userRole;
        document.getElementById('header-user-name').textContent = userName;
        document.getElementById('header-user-role').textContent = userRole;
        document.getElementById('banner-goal-val').textContent = `Maintain ${state.profile.goal}%+`;
        document.getElementById('banner-streak-val').textContent = `${state.profile.streak} Days`;
        document.getElementById('side-streak-count').textContent = `${state.profile.streak} Day Streak`;
        document.getElementById('side-safety-label').textContent = `SAFE ZONE: ${state.profile.goal}%`;

        // Update profile seeds
        const seedUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${state.profile.name || tcCurrentUser}`;
        document.getElementById('header-avatar').src = seedUrl;
        document.getElementById('banner-avatar').src = seedUrl;
        document.getElementById('settings-avatar-preview').src = seedUrl;

        // Tasks Done
        const doneTasks = state.tasks.filter(t => t.completed).length;
        document.getElementById('banner-tasks-val').textContent = `${String(doneTasks).padStart(2, '0')}/${String(state.tasks.length).padStart(2, '0')}`;

        // Focus Score levels
        let focusLevel = "Bronze";
        if (state.profile.focusMinutes > 200) focusLevel = "Platinum";
        else if (state.profile.focusMinutes > 100) focusLevel = "Elite";
        else if (state.profile.focusMinutes > 40) focusLevel = "Gold";
        else if (state.profile.focusMinutes > 15) focusLevel = "Silver";
        document.getElementById('banner-focus-score').textContent = focusLevel;
        document.getElementById('focus-zen-streak').textContent = `ZEN STREAK: ${state.profile.focusMinutes} MIN`;

        // Render Subject Cards
        const subjectCardsContainer = document.getElementById('dashboard-subject-cards');
        subjectCardsContainer.innerHTML = '';

        if (state.subjects.length === 0) {
            subjectCardsContainer.innerHTML = `
                <div class="empty-schedule-view" style="grid-column: span 3; width: 100%;">
                    <i data-lucide="book-x"></i>
                    <p>No subjects added yet. Add subjects in Subjects Manager.</p>
                </div>
            `;
        } else {
            state.subjects.forEach(sub => {
                const subMetrics = calculateSubjectMetrics(sub);
                const card = document.createElement('div');
                card.className = `subject-item-card ${subMetrics.status === 'DANGER' ? 'below-target' : ''}`;
                
                let iconGlyph = sub.icon || 'book-open';

                let bunkInfo = '';
                if (subMetrics.bunkAllowance >= 0) {
                    bunkInfo = `<span class="text-glow-green"><span class="bunk-count-inline">${subMetrics.bunkAllowance}</span> Bunks Left</span>`;
                    if (subMetrics.colorClass === 'warning') {
                        bunkInfo = `<span class="warning-state"><span class="bunk-count-inline">${subMetrics.bunkAllowance}</span> Bunks Left</span>`;
                    }
                } else {
                    bunkInfo = `<span class="danger-state">Attend next <span class="bunk-count-inline">${Math.abs(subMetrics.bunkAllowance)}</span></span>`;
                }

                let examLabel = '';
                if (sub.exam) {
                    const daysLeft = Math.ceil((new Date(sub.exam) - new Date()) / (1000 * 60 * 60 * 24));
                    if (daysLeft >= 0) {
                        examLabel = `<span style="font-size:10px; color:var(--text-muted); display:block; margin-top:2px;">Exam: in ${daysLeft} days</span>`;
                    }
                }

                card.innerHTML = `
                    <div class="subject-item-header">
                        <div class="subj-icon-box">
                            <i data-lucide="${iconGlyph}"></i>
                        </div>
                        <div class="subj-badge-val ${subMetrics.colorClass}">
                            ${subMetrics.percentage}%
                        </div>
                    </div>
                    <div>
                        <div class="subject-item-name">${sub.name}</div>
                        <div class="syllabus-row">
                            <div class="syllabus-labels">
                                <span>Syllabus</span>
                                <span>${sub.syllabus}%</span>
                            </div>
                            <div class="syllabus-bar-container">
                                <div class="syllabus-bar-fill" style="width: ${sub.syllabus}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="subject-item-footer">
                        <span class="subject-bunk-left-info">
                            ${bunkInfo}
                            ${examLabel}
                        </span>
                        <div class="db-actions-row">
                            <button class="db-icon-btn log-present" data-id="${sub.id}" title="Log Quick Present"><i data-lucide="check"></i></button>
                            <button class="db-icon-btn log-bunk" data-id="${sub.id}" title="Log Quick Bunk"><i data-lucide="x"></i></button>
                        </div>
                    </div>
                `;
                subjectCardsContainer.appendChild(card);
            });
        }

        // Render Recent Activity Logs
        const recentLogsContainer = document.getElementById('recent-logs-list');
        recentLogsContainer.innerHTML = '';

        if (state.logs.length === 0) {
            recentLogsContainer.innerHTML = `<div class="empty-panel-state"><i data-lucide="activity"></i><p>No recent activity logged.</p></div>`;
        } else {
            const sortedLogs = [...state.logs].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3);
            sortedLogs.forEach(log => {
                const logTime = new Date(log.timestamp);
                const formatTime = logTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                let dayLabel = "Today";
                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                
                if (logTime.toDateString() === yesterday.toDateString()) {
                    dayLabel = "Yesterday";
                } else if (logTime.toDateString() !== today.toDateString()) {
                    dayLabel = logTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
                }

                const item = document.createElement('div');
                item.className = "session-item";
                item.innerHTML = `
                    <div class="session-subj-meta">
                        <span class="session-subj-name">${log.subjectName}</span>
                        <span class="session-subj-time">${dayLabel}, ${formatTime}</span>
                    </div>
                    <span class="session-status-badge ${log.status.toLowerCase()}">${log.status}</span>
                `;
                recentLogsContainer.appendChild(item);
            });
        }

        // Render Predictions & Insights
        const insightsContainer = document.getElementById('dashboard-insights-list');
        insightsContainer.innerHTML = '';

        if (state.subjects.length === 0) {
            insightsContainer.innerHTML = `<div class="empty-panel-state"><i data-lucide="sparkles"></i><p>Generate predictions by adding subjects.</p></div>`;
        } else {
            const criticalSubs = state.subjects
                .map(s => ({ sub: s, metrics: calculateSubjectMetrics(s) }))
                .filter(item => item.metrics.status === 'DANGER');

            const warningSubs = state.subjects
                .map(s => ({ sub: s, metrics: calculateSubjectMetrics(s) }))
                .filter(item => item.metrics.status === 'WARNING');

            let insightsGenerated = 0;

            if (criticalSubs.length > 0) {
                criticalSubs.forEach(item => {
                    const block = document.createElement('div');
                    block.className = "insight-item";
                    block.innerHTML = `
                        <div class="insight-icon danger">
                            <i data-lucide="alert-octagon"></i>
                        </div>
                        <div class="insight-content">
                            <span class="insight-title">Critical Attention Required</span>
                            <span class="insight-desc">Your attendance in <strong>${item.sub.name}</strong> is at <strong>${item.metrics.percentage}%</strong>, below your goal of ${item.sub.target}%. Attend the next <strong>${Math.abs(item.metrics.bunkAllowance)}</strong> consecutive sessions to recover.</span>
                        </div>
                    `;
                    insightsContainer.appendChild(block);
                    insightsGenerated++;
                });
            }

            if (warningSubs.length > 0) {
                warningSubs.forEach(item => {
                    const block = document.createElement('div');
                    block.className = "insight-item";
                    block.innerHTML = `
                        <div class="insight-icon warning">
                            <i data-lucide="alert-triangle"></i>
                        </div>
                        <div class="insight-content">
                            <span class="insight-title">Approaching Danger Threshold</span>
                            <span class="insight-desc">You are only <strong>${(item.metrics.percentage - item.sub.target).toFixed(1)}%</strong> above threshold in <strong>${item.sub.name}</strong>. Bunking now is not advised.</span>
                        </div>
                    `;
                    insightsContainer.appendChild(block);
                    insightsGenerated++;
                });
            }

            if (insightsGenerated === 0) {
                const safestSub = state.subjects
                    .map(s => ({ sub: s, metrics: calculateSubjectMetrics(s) }))
                    .sort((a,b) => b.metrics.percentage - a.metrics.percentage)[0];

                const block = document.createElement('div');
                block.className = "insight-item";
                block.innerHTML = `
                    <div class="insight-icon safety">
                        <i data-lucide="sparkles"></i>
                    </div>
                    <div class="insight-content">
                        <span class="insight-title">Excellent Progress!</span>
                        <span class="insight-desc">All courses are safely within green margins. You have a secure bunk cushion of <strong>${safestSub.metrics.bunkAllowance}</strong> classes in <strong>${safestSub.sub.name}</strong>. Keep it up!</span>
                    </div>
                `;
                insightsContainer.appendChild(block);
            }
        }

        renderChecklist();

        // Reset simulator slider
        document.getElementById('simulator-slider').value = 0;
        document.getElementById('simulator-slider-value').textContent = "+0";
        document.getElementById('projected-result-value').textContent = `${metrics.percentage}%`;
        document.getElementById('projected-result-value').className = `projected-value ${metrics.colorClass}-state`;
        document.getElementById('projected-result-value').innerHTML = `${metrics.percentage}% <span class="badge-tag" style="background:${metrics.colorClass === 'safe' ? 'rgba(0, 230, 118, 0.08)' : (metrics.colorClass === 'warning' ? 'rgba(255, 179, 0, 0.08)' : 'rgba(255, 23, 68, 0.08)')}; border-color:var(--accent-${metrics.colorClass === 'safe' ? 'primary' : (metrics.colorClass === 'warning' ? 'warning' : 'danger')})">${metrics.status}</span>`;

        // Re-render Select inputs
        const focusSelect = document.getElementById('focus-subject-select');
        focusSelect.innerHTML = '';
        state.subjects.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.id;
            opt.textContent = sub.name;
            focusSelect.appendChild(opt);
        });

        try { lucide.createIcons(); } catch(e) { console.warn('Lucide icons error:', e); }
        attachQuickLogCardListeners();
    }

    function attachQuickLogCardListeners() {
        document.querySelectorAll('.log-present').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const subId = btn.getAttribute('data-id');
                const sub = state.subjects.find(s => s.id === subId);
                if (sub) {
                    sub.conducted++;
                    sub.attended++;
                    state.logs.push({
                        id: `log-${Date.now()}`,
                        subjectId: sub.id,
                        subjectName: sub.name,
                        status: 'PRESENT',
                        timestamp: new Date().toISOString()
                    });
                    state.profile.streak++;
                    saveState();
                    addToast(`Marked PRESENT in ${sub.name}! Streak +1`, 'success');
                    renderDashboard();
                }
            });
        });

        document.querySelectorAll('.log-bunk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const subId = btn.getAttribute('data-id');
                const sub = state.subjects.find(s => s.id === subId);
                if (sub) {
                    sub.conducted++;
                    state.logs.push({
                        id: `log-${Date.now()}`,
                        subjectId: sub.id,
                        subjectName: sub.name,
                        status: 'BUNKED',
                        timestamp: new Date().toISOString()
                    });
                    saveState();
                    addToast(`Marked BUNKED in ${sub.name}.`, 'warning');
                    renderDashboard();
                }
            });
        });
    }

    // ==========================================
    // 8. BUNK SIMULATOR SLIDER EVENT
    // ==========================================
    const simSlider = document.getElementById('simulator-slider');
    const simSliderVal = document.getElementById('simulator-slider-value');
    const simProjectedResult = document.getElementById('projected-result-value');

    simSlider.addEventListener('input', () => {
        const val = parseInt(simSlider.value);
        simSliderVal.textContent = `+${val}`;

        const projectedMetrics = calculateOverallMetrics(val);
        simProjectedResult.className = `projected-value ${projectedMetrics.colorClass}-state`;
        simProjectedResult.innerHTML = `${projectedMetrics.percentage}% <span class="badge-tag" style="background:${projectedMetrics.colorClass === 'safe' ? 'rgba(0, 230, 118, 0.08)' : (projectedMetrics.colorClass === 'warning' ? 'rgba(255, 179, 0, 0.08)' : 'rgba(255, 23, 68, 0.08)')}; border-color:var(--accent-${projectedMetrics.colorClass === 'safe' ? 'primary' : (projectedMetrics.colorClass === 'warning' ? 'warning' : 'danger')})">${projectedMetrics.status}</span>`;
        
        playSound('click');
    });

    // ==========================================
    // 9. ACTIVE FOCUS POMODORO SYSTEM
    // ==========================================
    const timerClock = document.getElementById('focus-timer-clock');
    const timerBar = document.getElementById('focus-timer-bar');
    const timerBtn = document.getElementById('focus-toggle-btn');
    
    let pomodoroInterval = null;
    let isTimerRunning = false;
    let timerTotalSeconds = 25 * 60;
    let timerRemainingSeconds = 25 * 60;
    const timerCircumference = 276;

    function updateTimerDisplay() {
        const mins = Math.floor(timerRemainingSeconds / 60);
        const secs = timerRemainingSeconds % 60;
        timerClock.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        const progressFrac = timerRemainingSeconds / timerTotalSeconds;
        const offset = timerCircumference - (progressFrac * timerCircumference);
        timerBar.style.strokeDashoffset = offset;
    }

    timerBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            clearInterval(pomodoroInterval);
            isTimerRunning = false;
            timerBtn.textContent = "Start Session";
            timerBtn.classList.remove('active');
            playSound('click');
        } else {
            isTimerRunning = true;
            timerBtn.textContent = "Pause Session";
            timerBtn.classList.add('active');
            playSound('success');

            pomodoroInterval = setInterval(() => {
                if (timerRemainingSeconds > 0) {
                    timerRemainingSeconds--;
                    updateTimerDisplay();
                } else {
                    clearInterval(pomodoroInterval);
                    isTimerRunning = false;
                    
                    const studyDuration = 25;
                    state.profile.focusMinutes += studyDuration;
                    saveState();
                    
                    playSound('complete');
                    addToast(`Focus session completed! You earned +25 Focus Score!`, 'success');
                    
                    timerRemainingSeconds = timerTotalSeconds;
                    updateTimerDisplay();
                    timerBtn.textContent = "Start Session";
                    timerBtn.classList.remove('active');
                    
                    renderDashboard();
                }
            }, 1000);
        }
    });

    timerBar.style.strokeDasharray = timerCircumference;
    updateTimerDisplay();

    // ==========================================
    // 10. TODO CHECKLIST MODULE
    // ==========================================
    function renderChecklist() {
        const todoContainer = document.getElementById('todo-list-container');
        const taskSubjectSelect = document.getElementById('todo-task-subject-select');
        
        todoContainer.innerHTML = '';
        taskSubjectSelect.innerHTML = '<option value="">Global</option>';

        state.subjects.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.id;
            opt.textContent = sub.name;
            taskSubjectSelect.appendChild(opt);
        });

        if (state.tasks.length === 0) {
            todoContainer.innerHTML = `<div class="empty-panel-state" style="padding:16px 0;"><p>All caught up! Add tasks above.</p></div>`;
            return;
        }

        state.tasks.forEach(task => {
            const el = document.createElement('div');
            el.className = `todo-item ${task.completed ? 'completed' : ''}`;
            
            const matchingSub = state.subjects.find(s => s.id === task.subjectId);
            const subTag = matchingSub ? `<span class="todo-subject-tag">${matchingSub.name}</span>` : `<span class="todo-subject-tag">Global</span>`;

            el.innerHTML = `
                <div class="todo-left">
                    <input type="checkbox" class="custom-chk" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    <div class="todo-details">
                        <span class="todo-item-text">${task.text}</span>
                        ${subTag}
                    </div>
                </div>
                <button class="btn-delete-task" data-id="${task.id}">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            todoContainer.appendChild(el);
        });

        // Event listeners
        todoContainer.querySelectorAll('.custom-chk').forEach(chk => {
            chk.addEventListener('change', () => {
                const taskId = chk.getAttribute('data-id');
                const task = state.tasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = chk.checked;
                    saveState();
                    playSound('click');
                    if (task.completed) {
                        addToast(`Task completed! Good job!`, 'success');
                    }
                    renderDashboard();
                }
            });
        });

        todoContainer.querySelectorAll('.btn-delete-task').forEach(btn => {
            btn.addEventListener('click', () => {
                const taskId = btn.getAttribute('data-id');
                state.tasks = state.tasks.filter(t => t.id !== taskId);
                saveState();
                playSound('alert');
                addToast("Task deleted.");
                renderDashboard();
            });
        });

        lucide.createIcons();
    }

    document.getElementById('todo-add-task-btn').addEventListener('click', () => {
        const textInput = document.getElementById('todo-new-task-input');
        const subjSelect = document.getElementById('todo-task-subject-select');
        
        if (textInput.value.trim() === '') {
            addToast("Task text cannot be empty!", 'error');
            return;
        }

        state.tasks.push({
            id: `task-${Date.now()}`,
            text: textInput.value.trim(),
            subjectId: subjSelect.value || null,
            completed: false
        });

        saveState();
        textInput.value = '';
        addToast("Added new task!", 'success');
        renderDashboard();
    });

    // ==========================================
    // 11. BUNK CALCULATOR FORM
    // ==========================================
    const calcRunBtn = document.getElementById('btn-run-calculator');
    const calcReportContainer = document.getElementById('calc-report-content');

    calcRunBtn.addEventListener('click', () => {
        const conducted = parseInt(document.getElementById('calc-conducted').value);
        const attended = parseInt(document.getElementById('calc-attended').value);
        const target = parseFloat(document.getElementById('calc-target').value);

        if (isNaN(conducted) || isNaN(attended) || isNaN(target) || conducted <= 0) {
            addToast("Please fill all calculator inputs with valid values.", 'error');
            return;
        }

        if (attended > conducted) {
            addToast("Attended classes cannot exceed conducted classes!", 'error');
            return;
        }

        const percentage = Math.round((attended / conducted) * 1000) / 10;
        let reportHTML = '';

        if (percentage >= target) {
            const targetFrac = target / 100;
            const maxConducted = Math.floor(attended / targetFrac);
            const safeBunks = Math.max(0, maxConducted - conducted);

            reportHTML = `
                <div class="full-report-body">
                    <div class="report-gauge-row">
                        <div class="report-stat-desc">
                            <span class="report-stat-num safe-state">${percentage}%</span>
                            <span class="report-stat-lbl">CURRENT RATIO</span>
                        </div>
                    </div>
                    <div class="report-details-grid">
                        <div class="report-pill-box"><span class="report-pill-title">Target Goal</span><span class="report-pill-value">${target}%</span></div>
                        <div class="report-pill-box"><span class="report-pill-title">Conducted</span><span class="report-pill-value">${conducted} Classes</span></div>
                        <div class="report-pill-box"><span class="report-pill-title">Attended</span><span class="report-pill-value">${attended} Classes</span></div>
                        <div class="report-pill-box"><span class="report-pill-title">Status Margin</span><span class="report-pill-value safe-state">+${(percentage - target).toFixed(1)}%</span></div>
                    </div>
                    <div class="report-advice-card">
                        <div class="advice-icon-wrap"><i data-lucide="check-circle" style="width:24px; height:24px;"></i></div>
                        <div class="advice-text-details">
                            <h4>You are in the Safe Zone!</h4>
                            <p>You can safely bunk up to <strong class="safe-state">${safeBunks}</strong> consecutive classes without dropping below your target threshold of ${target}%.</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const targetFrac = target / 100;
            const required = Math.ceil((targetFrac * conducted - attended) / (1 - targetFrac));

            reportHTML = `
                <div class="full-report-body">
                    <div class="report-gauge-row">
                        <div class="report-stat-desc">
                            <span class="report-stat-num danger-state">${percentage}%</span>
                            <span class="report-stat-lbl">CURRENT RATIO</span>
                        </div>
                    </div>
                    <div class="report-details-grid">
                        <div class="report-pill-box"><span class="report-pill-title">Target Goal</span><span class="report-pill-value">${target}%</span></div>
                        <div class="report-pill-box"><span class="report-pill-title">Conducted</span><span class="report-pill-value">${conducted} Classes</span></div>
                        <div class="report-pill-box"><span class="report-pill-title">Attended</span><span class="report-pill-value">${attended} Classes</span></div>
                        <div class="report-pill-box"><span class="report-pill-title">Status Margin</span><span class="report-pill-value danger-state">${(percentage - target).toFixed(1)}%</span></div>
                    </div>
                    <div class="report-advice-card danger">
                        <div class="advice-icon-wrap"><i data-lucide="alert-octagon" style="width:24px; height:24px;"></i></div>
                        <div class="advice-text-details">
                            <h4>Attendance Target Breached!</h4>
                            <p>To restore your safety margin, you must attend the next <strong class="danger-state">${required}</strong> classes consecutively. Any bunks now will drag you further into the danger zone.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        calcReportContainer.innerHTML = reportHTML;
        playSound('success');
        lucide.createIcons();
    });

    // ==========================================
    // 12. SUBJECTS MANAGERTAB
    // ==========================================
    const subjectForm = document.getElementById('subject-manager-form');
    const btnDashboardAddSubject = document.getElementById('btn-dashboard-add-subject');

    btnDashboardAddSubject.addEventListener('click', () => {
        switchTab('subjects');
        addToast("Fill in details to add a course.");
    });

    function renderSubjectsTab() {
        const grid = document.getElementById('manager-courses-grid');
        grid.innerHTML = '';

        if (state.subjects.length === 0) {
            grid.innerHTML = `<div class="empty-schedule-view" style="grid-column: span 2; width:100%;"><i data-lucide="book-open"></i><p>No subjects in the database. Use the creator form to add one.</p></div>`;
            lucide.createIcons();
            return;
        }

        state.subjects.forEach(sub => {
            const metrics = calculateSubjectMetrics(sub);
            const card = document.createElement('div');
            card.className = "db-subject-card";
            let iconGlyph = sub.icon || 'code';

            card.innerHTML = `
                <div class="db-card-header">
                    <div class="db-card-title">
                        <i data-lucide="${iconGlyph}" style="color:var(--accent-glow);"></i>
                        <h4>${sub.name}</h4>
                    </div>
                    <div class="db-actions-row">
                        <button class="db-icon-btn edit" data-id="${sub.id}" title="Edit Subject Details"><i data-lucide="edit-3"></i></button>
                        <button class="db-icon-btn delete" data-id="${sub.id}" title="Delete Subject"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
                <div class="db-stats-matrix">
                    <div class="db-stat-item">
                        <span class="db-stat-lbl">Ratio</span>
                        <span class="db-stat-val rate ${metrics.colorClass}-state">${metrics.percentage}%</span>
                    </div>
                    <div class="db-stat-item">
                        <span class="db-stat-lbl">Goal Target</span>
                        <span class="db-stat-val">${sub.target}%</span>
                    </div>
                    <div class="db-stat-item">
                        <span class="db-stat-lbl">Attended</span>
                        <span class="db-stat-val font-mono">${sub.attended}/${sub.conducted}</span>
                    </div>
                    <div class="db-stat-item">
                        <span class="db-stat-lbl">Syllabus</span>
                        <span class="db-stat-val">${sub.syllabus}%</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        // Add action listeners
        grid.querySelectorAll('.db-icon-btn.edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const subId = btn.getAttribute('data-id');
                const sub = state.subjects.find(s => s.id === subId);
                if (sub) {
                    document.getElementById('edit-subject-id').value = sub.id;
                    document.getElementById('subject-name').value = sub.name;
                    document.getElementById('subject-conducted').value = sub.conducted;
                    document.getElementById('subject-attended').value = sub.attended;
                    document.getElementById('subject-target').value = sub.target;
                    document.getElementById('subject-syllabus').value = sub.syllabus;
                    document.getElementById('subject-exam').value = sub.exam || '';
                    
                    const iconRadio = document.querySelector(`input[name="subject-icon"][value="${sub.icon || 'code'}"]`);
                    if (iconRadio) iconRadio.checked = true;

                    document.getElementById('subject-form-title').textContent = "Edit Course Details";
                    document.getElementById('subject-form-submit-btn').innerHTML = `<i data-lucide="save"></i> Save Changes`;
                    document.getElementById('subject-form-reset-btn').style.display = 'block';
                    
                    addToast(`Loaded ${sub.name} details into form.`, 'success');
                    lucide.createIcons();
                }
            });
        });

        grid.querySelectorAll('.db-icon-btn.delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const subId = btn.getAttribute('data-id');
                const sub = state.subjects.find(s => s.id === subId);
                if (sub && confirm(`Delete subject ${sub.name}? All history records and logs will be permanently deleted.`)) {
                    state.subjects = state.subjects.filter(s => s.id !== subId);
                    state.logs = state.logs.filter(l => l.subjectId !== subId);
                    state.tasks = state.tasks.filter(t => t.subjectId !== subId);
                    state.schedule = state.schedule.filter(s => s.subjectId !== subId);
                    
                    saveState();
                    playSound('alert');
                    addToast(`Deleted ${sub.name} and purged history.`, 'error');
                    renderSubjectsTab();
                }
            });
        });

        lucide.createIcons();
    }

    subjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const subId = document.getElementById('edit-subject-id').value;
        const name = document.getElementById('subject-name').value.trim();
        const icon = document.querySelector('input[name="subject-icon"]:checked').value;
        const conducted = parseInt(document.getElementById('subject-conducted').value);
        const attended = parseInt(document.getElementById('subject-attended').value);
        const target = parseInt(document.getElementById('subject-target').value);
        const syllabus = parseInt(document.getElementById('subject-syllabus').value);
        const exam = document.getElementById('subject-exam').value;

        if (attended > conducted) {
            addToast("Attended classes cannot exceed conducted classes!", 'error');
            return;
        }

        if (subId) {
            const idx = state.subjects.findIndex(s => s.id === subId);
            if (idx !== -1) {
                state.subjects[idx] = {
                    ...state.subjects[idx],
                    name, icon, conducted, attended, target, syllabus, exam
                };
                addToast("Subject saved successfully!", 'success');
            }
        } else {
            state.subjects.push({
                id: `sub-${Date.now()}`,
                name, icon, conducted, attended, target, syllabus, exam
            });
            addToast(`Successfully added course ${name}!`, 'success');
        }

        saveState();
        resetSubjectForm();
        renderSubjectsTab();
    });

    document.getElementById('subject-form-reset-btn').addEventListener('click', resetSubjectForm);

    function resetSubjectForm() {
        document.getElementById('edit-subject-id').value = '';
        subjectForm.reset();
        document.getElementById('subject-form-title').textContent = "Create New Subject";
        document.getElementById('subject-form-submit-btn').innerHTML = `<i data-lucide="plus"></i> Add Course`;
        document.getElementById('subject-form-reset-btn').style.display = 'none';
        lucide.createIcons();
    }

    // ==========================================
    // 13. RENDER LOGIC: TIMETABLE SCHEDULES
    // ==========================================
    const timetableSlotForm = document.getElementById('timetable-slot-form');
    const dayTabButtons = document.querySelectorAll('.day-tab-btn');
    let selectedSchedulerDay = "Monday";

    dayTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dayTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSchedulerDay = btn.getAttribute('data-day');
            renderTimetableSlots();
            playSound('click');
        });
    });

    function renderTimetable() {
        const select = document.getElementById('slot-subject');
        select.innerHTML = '';
        
        state.subjects.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.id;
            opt.textContent = sub.name;
            select.appendChild(opt);
        });

        renderTimetableSlots();
    }

    function renderTimetableSlots() {
        const list = document.getElementById('timetable-slots-list');
        list.innerHTML = '';

        const activeDaySlots = state.schedule.filter(s => s.day === selectedSchedulerDay);

        if (activeDaySlots.length === 0) {
            list.innerHTML = `
                <div class="empty-schedule-view">
                    <i data-lucide="calendar-x"></i>
                    <p>No classes scheduled for <strong>${selectedSchedulerDay}</strong>.<br>Use the creators to plan your classes.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        activeDaySlots.sort((a,b) => a.start.localeCompare(b.start));

        activeDaySlots.forEach(slot => {
            const item = document.createElement('div');
            item.className = "slot-item";
            item.innerHTML = `
                <div class="slot-meta">
                    <span class="slot-time-range">${slot.start} - ${slot.end}</span>
                    <span class="slot-subject-title">${slot.subjectName}</span>
                </div>
                <div class="slot-actions">
                    <button class="slot-log-btn present" data-id="${slot.id}" data-subject-id="${slot.subjectId}" title="Log Quick Present"><i data-lucide="check"></i> Present</button>
                    <button class="slot-log-btn bunked" data-id="${slot.id}" data-subject-id="${slot.subjectId}" title="Log Quick Bunk"><i data-lucide="x"></i> Bunk</button>
                    <button class="btn-remove-slot" data-id="${slot.id}" title="Remove slot from schedule"><i data-lucide="trash-2"></i></button>
                </div>
            `;
            list.appendChild(item);
        });

        // Timetable quick logging click actions
        list.querySelectorAll('.slot-log-btn.present').forEach(btn => {
            btn.addEventListener('click', () => {
                const subId = btn.getAttribute('data-subject-id');
                const sub = state.subjects.find(s => s.id === subId);
                if (sub) {
                    sub.conducted++;
                    sub.attended++;
                    state.logs.push({
                        id: `log-${Date.now()}`,
                        subjectId: sub.id,
                        subjectName: sub.name,
                        status: 'PRESENT',
                        timestamp: new Date().toISOString()
                    });
                    state.profile.streak++;
                    saveState();
                    addToast(`Marked PRESENT in ${sub.name}! Streak +1`, 'success');
                    renderTimetableSlots();
                }
            });
        });

        list.querySelectorAll('.slot-log-btn.bunked').forEach(btn => {
            btn.addEventListener('click', () => {
                const subId = btn.getAttribute('data-subject-id');
                const sub = state.subjects.find(s => s.id === subId);
                if (sub) {
                    sub.conducted++;
                    state.logs.push({
                        id: `log-${Date.now()}`,
                        subjectId: sub.id,
                        subjectName: sub.name,
                        status: 'BUNKED',
                        timestamp: new Date().toISOString()
                    });
                    saveState();
                    addToast(`Marked BUNKED in ${sub.name}`, 'warning');
                    renderTimetableSlots();
                }
            });
        });

        list.querySelectorAll('.btn-remove-slot').forEach(btn => {
            btn.addEventListener('click', () => {
                const slotId = btn.getAttribute('data-id');
                state.schedule = state.schedule.filter(s => s.id !== slotId);
                saveState();
                playSound('alert');
                addToast("Slot removed from schedule.");
                renderTimetableSlots();
            });
        });

        lucide.createIcons();
    }

    timetableSlotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const day = document.getElementById('slot-day').value;
        const subId = document.getElementById('slot-subject').value;
        const start = document.getElementById('slot-start').value;
        const end = document.getElementById('slot-end').value;

        const sub = state.subjects.find(s => s.id === subId);
        if (!sub) {
            addToast("Please select a subject.", 'error');
            return;
        }

        if (start >= end) {
            addToast("End time must be after start time!", 'error');
            return;
        }

        state.schedule.push({
            id: `slot-${Date.now()}`,
            day,
            subjectId: sub.id,
            subjectName: sub.name,
            start,
            end
        });

        saveState();
        timetableSlotForm.reset();
        addToast("Slot added successfully!", 'success');
        
        selectedSchedulerDay = day;
        dayTabButtons.forEach(b => {
            b.classList.remove('active');
            if (b.getAttribute('data-day') === day) b.classList.add('active');
        });
        
        renderTimetableSlots();
    });

    // ==========================================
    // 14. FAST GRID TIMETABLE MATRIX GENERATOR
    // ==========================================
    const modalTimetableMatrix = document.getElementById('modal-timetable-generator');
    const btnTriggerTimetableMatrix = document.getElementById('btn-trigger-timetable-matrix');
    const btnCloseTimetableMatrix = document.getElementById('btn-close-timetable-matrix');
    const btnCancelTimetableMatrix = document.getElementById('btn-cancel-timetable-matrix');
    const btnSaveTimetableMatrix = document.getElementById('btn-save-timetable-matrix');

    // Matrix specific periods templates list
    let matrixPeriods = [
        { start: "09:00", end: "10:00" },
        { start: "10:15", end: "11:15" },
        { start: "11:30", end: "12:30" },
        { start: "13:30", end: "14:30" },
        { start: "14:45", end: "15:45" }
    ];

    // Temporary schedule generated during click builder
    let tempMatrixSchedule = [];

    btnTriggerTimetableMatrix.addEventListener('click', () => {
        if (state.subjects.length === 0) {
            addToast("Please create subjects inside Subjects Manager first!", 'error');
            switchTab('subjects');
            return;
        }
        
        // Clone existing schedule slots into temporary compiler
        tempMatrixSchedule = [...state.schedule];

        renderMatrixConfigAndGrid();
        modalTimetableMatrix.classList.add('active');
        playSound('click');
    });

    // Render configurator timings rows + Visualclickable table
    function renderMatrixConfigAndGrid() {
        // 1. Render Timing slot templates inputs on the left
        const configContainer = document.getElementById('matrix-period-slots');
        configContainer.innerHTML = '';

        matrixPeriods.forEach((period, idx) => {
            const item = document.createElement('div');
            item.className = "period-slot-config-item";
            item.innerHTML = `
                <span class="period-slot-label-num">P${idx+1}</span>
                <div class="period-slot-time-inputs">
                    <input type="time" class="form-input matrix-p-start" data-idx="${idx}" value="${period.start}">
                    <span style="color:var(--text-muted); font-size:10px;">to</span>
                    <input type="time" class="form-input matrix-p-end" data-idx="${idx}" value="${period.end}">
                </div>
                <button class="period-slot-delete-btn" data-idx="${idx}" title="Remove template slot"><i data-lucide="trash-2"></i></button>
            `;
            configContainer.appendChild(item);
        });

        // Add timing input change listeners
        configContainer.querySelectorAll('.matrix-p-start').forEach(input => {
            input.addEventListener('change', () => {
                const idx = parseInt(input.getAttribute('data-idx'));
                matrixPeriods[idx].start = input.value;
            });
        });

        configContainer.querySelectorAll('.matrix-p-end').forEach(input => {
            input.addEventListener('change', () => {
                const idx = parseInt(input.getAttribute('data-idx'));
                matrixPeriods[idx].end = input.value;
            });
        });

        configContainer.querySelectorAll('.period-slot-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                matrixPeriods.splice(idx, 1);
                playSound('alert');
                renderMatrixConfigAndGrid();
            });
        });

        // 2. Render clickable matrix table cells on the right
        const tbody = document.getElementById('matrix-grid-tbody');
        tbody.innerHTML = '';

        const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        matrixPeriods.forEach((period, pIdx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:700; font-size:12px; color:var(--text-muted);">P${pIdx+1} (${period.start}-${period.end})</td>
            `;

            weekDays.forEach(day => {
                const td = document.createElement('td');
                
                // Find if a slot already mapped to this period and day
                const matchedSlot = tempMatrixSchedule.find(s => s.day === day && s.start === period.start && s.end === period.end);

                if (matchedSlot) {
                    td.className = "matrix-cell filled";
                    td.textContent = matchedSlot.subjectName;
                } else {
                    td.className = "matrix-cell";
                    td.innerHTML = `<span class="matrix-cell-empty">Empty</span>`;
                }

                // Click event opens a custom subject-select popup popover
                td.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openMatrixCellPopup(td, day, period);
                });

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        lucide.createIcons();
    }

    // Add period Timing Template slot button
    document.getElementById('matrix-btn-add-period-row').addEventListener('click', () => {
        matrixPeriods.push({ start: "08:00", end: "09:00" });
        playSound('click');
        renderMatrixConfigAndGrid();
    });

    // Floating Custom popover select list
    let activeCellPopup = null;

    function openMatrixCellPopup(cellElement, day, period) {
        // Remove existing popups
        if (activeCellPopup) activeCellPopup.remove();

        const popup = document.createElement('div');
        popup.className = "matrix-select-popup animate-reveal";

        // Mapped options for subjects
        state.subjects.forEach(sub => {
            const opt = document.createElement('div');
            opt.className = "matrix-select-option";
            opt.textContent = sub.name;
            opt.addEventListener('click', () => {
                // Remove existing slot on this day & time first
                tempMatrixSchedule = tempMatrixSchedule.filter(s => !(s.day === day && s.start === period.start && s.end === period.end));
                
                // Add new slot
                tempMatrixSchedule.push({
                    id: `slot-mat-${Date.now()}-${Math.random()}`,
                    day: day,
                    subjectId: sub.id,
                    subjectName: sub.name,
                    start: period.start,
                    end: period.end
                });

                playSound('click');
                popup.remove();
                renderMatrixConfigAndGrid();
            });
            popup.appendChild(opt);
        });

        // Add Clear Option
        const clearOpt = document.createElement('div');
        clearOpt.className = "matrix-select-option clear";
        clearOpt.innerHTML = `<i data-lucide="trash-2"></i> Clear Slot`;
        clearOpt.addEventListener('click', () => {
            tempMatrixSchedule = tempMatrixSchedule.filter(s => !(s.day === day && s.start === period.start && s.end === period.end));
            playSound('alert');
            popup.remove();
            renderMatrixConfigAndGrid();
        });
        popup.appendChild(clearOpt);

        document.body.appendChild(popup);
        lucide.createIcons();

        // Positioning absolute coordinates next to cell element clicked
        const rect = cellElement.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;

        activeCellPopup = popup;

        // Dismiss popup clicking outside
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target) && e.target !== cellElement) {
                popup.remove();
                document.removeEventListener('click', closePopup);
            }
        });
    }

    // Modal Close
    btnCloseTimetableMatrix.addEventListener('click', () => { modalTimetableMatrix.classList.remove('active'); if(activeCellPopup) activeCellPopup.remove(); });
    btnCancelTimetableMatrix.addEventListener('click', () => { modalTimetableMatrix.classList.remove('active'); if(activeCellPopup) activeCellPopup.remove(); });

    // Apply Timetable Grid matrix saves
    btnSaveTimetableMatrix.addEventListener('click', () => {
        state.schedule = tempMatrixSchedule;
        saveState();
        modalTimetableMatrix.classList.remove('active');
        
        if (activeCellPopup) activeCellPopup.remove();
        
        playSound('success');
        addToast("Weekly schedule updated via Matrix Builder!", 'success');
        renderTimetableSlots();
    });


    // ==========================================
    // 15. PROFILE EDIT & BACKUPS
    // ==========================================
    const profileDetailsForm = document.getElementById('profile-details-form');
    const seedInput = document.getElementById('profile-avatar-seed');
    const themeButtons = document.querySelectorAll('.theme-preset-btn');
    const soundToggle = document.getElementById('system-audio-toggle');

    function renderProfileTab() {
        document.getElementById('profile-name').value = state.profile.name || tcCurrentUser || "";
        document.getElementById('profile-role').value = state.profile.role || "";
        document.getElementById('profile-streak').value = state.profile.streak || 0;
        document.getElementById('profile-goal').value = state.profile.goal || 75;
        
        // Sync avatar seed input with the current profile name
        const avatarSeed = state.profile.name || tcCurrentUser || 'Student';
        document.getElementById('profile-avatar-seed').value = avatarSeed;
        const seedUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;
        document.getElementById('settings-avatar-preview').src = seedUrl;
        
        soundToggle.checked = state.settings.soundEnabled;

        themeButtons.forEach(btn => btn.classList.remove('active'));
        const activeThemeBtn = document.querySelector(`.theme-preset-btn[data-theme="${state.settings.theme || 'cyber'}"]`);
        if (activeThemeBtn) activeThemeBtn.classList.add('active');
    }

    seedInput.addEventListener('input', () => {
        const seed = seedInput.value.trim() || tcCurrentUser || 'Alex';
        const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
        document.getElementById('settings-avatar-preview').src = url;
        document.getElementById('header-avatar').src = url;
        const bannerAv = document.getElementById('banner-avatar');
        if (bannerAv) bannerAv.src = url;
        
        state.profile.name = seed;
        saveState();
    });

    profileDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        state.profile.name = document.getElementById('profile-name').value.trim();
        state.profile.role = document.getElementById('profile-role').value.trim();
        state.profile.streak = parseInt(document.getElementById('profile-streak').value) || 0;
        state.profile.goal = parseInt(document.getElementById('profile-goal').value) || 75;

        saveState();
        addToast("Settings profile details updated!", 'success');
        renderDashboard();
    });

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.getAttribute('data-theme');
            state.settings.theme = theme;
            saveState();

            document.body.className = `theme-${theme}`;
            playSound('success');
            addToast(`Theme accent: ${btn.querySelector('.theme-preset-name').textContent}`, 'success');
        });
    });

    soundToggle.addEventListener('change', () => {
        state.settings.soundEnabled = soundToggle.checked;
        saveState();
        playSound('click');
        addToast(soundToggle.checked ? "Synth Sounds Activated!" : "Cockpit muted.");
    });

    // JSON Data Export
    document.getElementById('btn-export-backup').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const anchor = document.createElement('a');
        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", `TryCatch75_${tcCurrentUser}_Backup.json`);
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        addToast("Local JSON backup downloaded!", 'success');
    });

    // JSON Data Import
    document.getElementById('import-backup-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const parsed = JSON.parse(evt.target.result);
                if (parsed.profile && parsed.subjects && parsed.logs) {
                    state = parsed;
                    saveState();
                    document.body.className = `theme-${state.settings.theme || 'cyber'}`;
                    playSound('success');
                    addToast("Data registry restored safely!", 'success');
                    
                    const activeTab = document.querySelector('.nav-tab.active').getAttribute('data-tab');
                    switchTab(activeTab);
                } else {
                    addToast("Invalid JSON Backup file format.", 'error');
                }
            } catch (err) {
                addToast("Error parsing backup JSON file.", 'error');
            }
        };
        reader.readAsText(file);
    });

    // Factory Reset Cockpit
    document.getElementById('btn-factory-reset').addEventListener('click', () => {
        if (confirm("WARNING: Wipe all statistics and records for this user? This cannot be undone.")) {
            state = {
                profile: { name: tcCurrentUser, role: "Student", goal: 75, streak: 0, focusMinutes: 0 },
                subjects: [],
                logs: [],
                tasks: [],
                schedule: [],
                settings: { theme: "cyber", soundEnabled: true }
            };
            saveState();
            document.body.className = "theme-cyber";
            playSound('alert');
            addToast("User data reset successfully.", 'error');
            switchTab('dashboard');
            launchOnboardingWizard();
        }
    });


    // ==========================================
    // 16. QUICK LOG ATTENDANCE PANEL
    // ==========================================
    const modalQuickLog = document.getElementById('modal-quick-log');
    const btnFabLog = document.getElementById('btn-fab-log');
    const btnCloseQuickLog = document.getElementById('btn-close-quick-log');
    const quickLogForm = document.getElementById('quick-log-form');

    btnFabLog.addEventListener('click', () => {
        const select = document.getElementById('quick-log-subject-select');
        select.innerHTML = '';

        if (state.subjects.length === 0) {
            addToast("Please create subjects inside Subjects Manager first!", 'error');
            switchTab('subjects');
            return;
        }

        state.subjects.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.id;
            opt.textContent = sub.name;
            select.appendChild(opt);
        });

        const now = new Date();
        document.getElementById('quick-log-date').value = now.toISOString().slice(0, 10);
        document.getElementById('quick-log-time').value = now.toTimeString().slice(0, 5);

        modalQuickLog.classList.add('active');
        playSound('click');
    });

    btnCloseQuickLog.addEventListener('click', () => {
        modalQuickLog.classList.remove('active');
        playSound('click');
    });

    quickLogForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const subId = document.getElementById('quick-log-subject-select').value;
        const date = document.getElementById('quick-log-date').value;
        const time = document.getElementById('quick-log-time').value;
        const status = document.querySelector('input[name="quick-status"]:checked').value;

        const sub = state.subjects.find(s => s.id === subId);
        if (sub) {
            sub.conducted++;
            if (status === 'PRESENT') {
                sub.attended++;
                state.profile.streak++;
            }
            
            state.logs.push({
                id: `log-${Date.now()}`,
                subjectId: sub.id,
                subjectName: sub.name,
                status,
                timestamp: `${date}T${time}:00`
            });

            saveState();
            modalQuickLog.classList.remove('active');
            
            addToast(`Logged ${status} session for ${sub.name}!`, 'success');
            
            const activeTab = document.querySelector('.nav-tab.active').getAttribute('data-tab');
            if (activeTab === 'dashboard') renderDashboard();
            else if (activeTab === 'timetable') renderTimetableSlots();
        }
    });


    // ==========================================
    // 17. EDITABLE HISTORY MODAL CONTROLLER
    // ==========================================
    const modalHistoryLogs = document.getElementById('modal-history-logs');
    const btnViewHistory = document.getElementById('btn-view-history');
    const btnFullHistory = document.getElementById('btn-full-history');
    const btnCloseHistoryLogs = document.getElementById('btn-close-history-logs');
    const historySearch = document.getElementById('history-search-input');
    const historyFilter = document.getElementById('history-filter-status');
    const historyTbody = document.getElementById('history-logs-tbody');
    const historyEmpty = document.getElementById('history-empty-view');

    function openHistoryModal() {
        renderHistoryLogsTable();
        modalHistoryLogs.classList.add('active');
        playSound('click');
    }

    btnViewHistory.addEventListener('click', openHistoryModal);
    btnFullHistory.addEventListener('click', openHistoryModal);
    btnCloseHistoryLogs.addEventListener('click', () => { modalHistoryLogs.classList.remove('active'); });

    function renderHistoryLogsTable() {
        historyTbody.innerHTML = '';
        const searchVal = historySearch.value.trim().toLowerCase();
        const filterVal = historyFilter.value;

        let filteredLogs = [...state.logs];

        if (searchVal !== '') {
            filteredLogs = filteredLogs.filter(l => l.subjectName.toLowerCase().includes(searchVal));
        }

        if (filterVal !== 'ALL') {
            filteredLogs = filteredLogs.filter(l => l.status === filterVal);
        }

        filteredLogs.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (filteredLogs.length === 0) {
            historyEmpty.style.display = 'flex';
            return;
        }

        historyEmpty.style.display = 'none';

        filteredLogs.forEach(log => {
            const tr = document.createElement('tr');
            const logTime = new Date(log.timestamp);
            const formattedDate = logTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + `, ` + logTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            tr.innerHTML = `
                <td style="font-weight:600;">${log.subjectName}</td>
                <td class="font-mono" style="color:var(--text-secondary);">${formattedDate}</td>
                <td><span class="session-status-badge ${log.status.toLowerCase()}">${log.status}</span></td>
                <td style="text-align: right;">
                    <button class="slot-log-btn edit-log-status" data-id="${log.id}" style="display:inline-flex; padding:4px 8px; font-size:10px;" title="Cycle Status Action">Cycle Status</button>
                    <button class="db-icon-btn delete-log" data-id="${log.id}" style="display:inline-flex; vertical-align:middle; margin-left:8px;" title="Purge Record"><i data-lucide="trash-2"></i></button>
                </td>
            `;
            historyTbody.appendChild(tr);
        });

        // Cycle status Present -> Bunked -> Absent -> Cancelled
        historyTbody.querySelectorAll('.edit-log-status').forEach(btn => {
            btn.addEventListener('click', () => {
                const logId = btn.getAttribute('data-id');
                const log = state.logs.find(l => l.id === logId);
                const sub = state.subjects.find(s => s.id === log.subjectId);
                
                if (log && sub) {
                    const statusSequence = ['PRESENT', 'BUNKED', 'ABSENT', 'CANCELLED'];
                    const currentIdx = statusSequence.indexOf(log.status);
                    const nextStatus = statusSequence[(currentIdx + 1) % statusSequence.length];

                    // Backtrack stats
                    sub.conducted--;
                    if (log.status === 'PRESENT') {
                        sub.attended--;
                        state.profile.streak = Math.max(0, state.profile.streak - 1);
                    }

                    // Apply new status values
                    sub.conducted++;
                    if (nextStatus === 'PRESENT') {
                        sub.attended++;
                        state.profile.streak++;
                    }

                    log.status = nextStatus;
                    
                    saveState();
                    playSound('success');
                    addToast(`Updated log state to ${nextStatus}!`, 'success');
                    
                    renderHistoryLogsTable();
                    renderDashboard();
                }
            });
        });

        historyTbody.querySelectorAll('.delete-log').forEach(btn => {
            btn.addEventListener('click', () => {
                const logId = btn.getAttribute('data-id');
                const log = state.logs.find(l => l.id === logId);
                const sub = state.subjects.find(s => s.id === log.subjectId);
                
                if (log && sub && confirm(`Delete this history entry for ${log.subjectName}?`)) {
                    sub.conducted--;
                    if (log.status === 'PRESENT') {
                        sub.attended--;
                        state.profile.streak = Math.max(0, state.profile.streak - 1);
                    }

                    state.logs = state.logs.filter(l => l.id !== logId);
                    
                    saveState();
                    playSound('alert');
                    addToast("Purged attendance record.");
                    
                    renderHistoryLogsTable();
                    renderDashboard();
                }
            });
        });

        lucide.createIcons();
    }

    historySearch.addEventListener('input', renderHistoryLogsTable);
    historyFilter.addEventListener('change', renderHistoryLogsTable);


    // ==========================================
    // 18. SHORTCUT KEYBOARD COMMAND PALETTE
    // ==========================================
    const modalPalette = document.getElementById('modal-command-palette');
    const paletteInput = document.getElementById('palette-input-query');
    const paletteList = document.getElementById('palette-suggestions');
    
    const COMMAND_ITEMS = [
        { label: "Switch to Dashboard tab", query: "go dashboard", cat: "Navigation", act: () => switchTab('dashboard') },
        { label: "Switch to Bunk Calculator", query: "go calculator", cat: "Navigation", act: () => switchTab('calculator') },
        { label: "Switch to Subjects Manager", query: "go subjects", cat: "Navigation", act: () => switchTab('subjects') },
        { label: "Switch to Weekly Timetable", query: "go timetable", cat: "Navigation", act: () => switchTab('timetable') },
        { label: "Switch to Profile Settings", query: "go settings", cat: "Navigation", act: () => switchTab('profile') },
        
        { label: "Set visual theme to Cyber Glow", query: "theme cyber", cat: "Theme", act: () => document.getElementById('theme-btn-cyber').click() },
        { label: "Set visual theme to Crimson Code", query: "theme crimson", cat: "Theme", act: () => document.getElementById('theme-btn-crimson').click() },
        { label: "Set visual theme to Starlight Cyan", query: "theme starlight", cat: "Theme", act: () => document.getElementById('theme-btn-starlight').click() },
        { label: "Set visual theme to Midnight Monochrome", query: "theme monochrome", cat: "Theme", act: () => document.getElementById('theme-btn-monochrome').click() },
        
        { label: "Start Pomodoro session clock", query: "start focus", cat: "Focus", act: () => { if(!isTimerRunning) timerBtn.click(); } },
        { label: "Pause Focus session countdown", query: "pause focus", cat: "Focus", act: () => { if(isTimerRunning) timerBtn.click(); } },
        { label: "Trigger quick log attendance sheet", query: "quick log class", cat: "Session", act: () => btnFabLog.click() },
        { label: "Export backup data to local file", query: "export backup", cat: "Database", act: () => document.getElementById('btn-export-backup').click() },
        { label: "Sign out of account", query: "sign out logout", cat: "Session", act: executeSignOut }
    ];

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (tcCurrentUser) openCommandPalette();
        }
    });

    document.getElementById('global-search-input').addEventListener('focus', (e) => {
        e.preventDefault();
        e.target.blur();
        if (tcCurrentUser) openCommandPalette();
    });

    function openCommandPalette() {
        paletteInput.value = '';
        renderPaletteSuggestions();
        modalPalette.classList.add('active');
        playSound('click');
        setTimeout(() => paletteInput.focus(), 100);
    }

    modalPalette.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalPalette.classList.remove('active');
            playSound('click');
        }
    });

    modalPalette.addEventListener('click', (e) => {
        if (e.target === modalPalette) {
            modalPalette.classList.remove('active');
            playSound('click');
        }
    });

    paletteInput.addEventListener('input', renderPaletteSuggestions);

    let selectedPaletteIndex = 0;

    function renderPaletteSuggestions() {
        paletteList.innerHTML = '';
        const val = paletteInput.value.trim().toLowerCase();
        let matched = COMMAND_ITEMS;

        if (val !== '') {
            matched = COMMAND_ITEMS.filter(c => c.query.includes(val) || c.label.toLowerCase().includes(val));
        }

        if (matched.length === 0) {
            paletteList.innerHTML = `<div class="empty-panel-state"><i data-lucide="compass"></i><p>No shortcut matching query.</p></div>`;
            lucide.createIcons();
            return;
        }

        selectedPaletteIndex = Math.min(selectedPaletteIndex, matched.length - 1);
        if (selectedPaletteIndex < 0) selectedPaletteIndex = 0;

        matched.forEach((c, idx) => {
            const item = document.createElement('div');
            item.className = `palette-item ${idx === selectedPaletteIndex ? 'selected' : ''}`;
            
            let catIcon = "terminal";
            if (c.cat === "Navigation") catIcon = "compass";
            if (c.cat === "Theme") catIcon = "palette";
            if (c.cat === "Focus") catIcon = "timer";

            item.innerHTML = `
                <div class="palette-item-left">
                    <div class="palette-item-icon"><i data-lucide="${catIcon}"></i></div>
                    <span class="palette-item-text">${c.label}</span>
                </div>
                <span class="palette-item-category">${c.cat}</span>
            `;
            
            item.addEventListener('click', () => {
                c.act();
                modalPalette.classList.remove('active');
            });
            paletteList.appendChild(item);
        });

        lucide.createIcons();
    }

    paletteInput.addEventListener('keydown', (e) => {
        const val = paletteInput.value.trim().toLowerCase();
        const matched = val === '' ? COMMAND_ITEMS : COMMAND_ITEMS.filter(c => c.query.includes(val) || c.label.toLowerCase().includes(val));
        
        if (matched.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedPaletteIndex = (selectedPaletteIndex + 1) % matched.length;
            renderPaletteSuggestions();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedPaletteIndex = (selectedPaletteIndex - 1 + matched.length) % matched.length;
            renderPaletteSuggestions();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            matched[selectedPaletteIndex].act();
            modalPalette.classList.remove('active');
        }
    });

    // ==========================================
    // 19. NOTIFICATIONS PANEL
    // ==========================================
    const notifBtnContainer = document.getElementById('notif-btn-container');
    const notifBell = document.getElementById('notification-bell');
    const notifPanel = document.getElementById('notifications-panel');
    const notifList = document.getElementById('notifications-list');
    const notifDot = notifBtnContainer.querySelector('.notification-dot');
    
    let mockNotifications = [
        { id: "n-1", type: "info", text: "Welcome to TryCatch75 Command Center dashboard!", time: "Just now" }
    ];

    notifBell.addEventListener('click', (e) => {
        e.stopPropagation();
        notifPanel.classList.toggle('active');
        notifDot.classList.remove('active');
        playSound('click');
        renderNotifications();
    });

    document.addEventListener('click', (e) => {
        if (!notifBtnContainer.contains(e.target)) {
            notifPanel.classList.remove('active');
        }
    });

    function renderNotifications() {
        notifList.innerHTML = '';

        if (mockNotifications.length === 0) {
            notifList.innerHTML = `<div class="empty-panel-state"><i data-lucide="bell-off"></i><p>Notifications tray is empty.</p></div>`;
            lucide.createIcons();
            return;
        }

        mockNotifications.forEach(n => {
            const el = document.createElement('div');
            el.className = "notif-item";
            let icon = 'info';
            if (n.type === 'warning') icon = 'alert-triangle';

            el.innerHTML = `
                <div class="notif-item-icon ${n.type}"><i data-lucide="${icon}"></i></div>
                <div class="notif-item-body">
                    <span class="notif-item-text">${n.text}</span>
                    <span class="notif-item-time">${n.time}</span>
                </div>
            `;
            notifList.appendChild(el);
        });
        lucide.createIcons();
    }

    document.getElementById('clear-notifications').addEventListener('click', (e) => {
        e.stopPropagation();
        mockNotifications = [];
        renderNotifications();
        playSound('alert');
        addToast("Notifications tray cleared.");
    });


    // ==========================================
    // 20. INITIAL LOAD PROCEDURES & ROUTING
    // ==========================================
    function switchTab(tabName) {
        const matchingTab = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
        if (matchingTab) {
            // Remove active classes
            tabs.forEach(t => t.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            // Set active
            matchingTab.classList.add('active');
            const targetView = document.getElementById(`view-${tabName}`);
            if (targetView) targetView.classList.add('active');

            try {
                if (tabName === 'timetable') renderTimetable();
                else if (tabName === 'subjects') renderSubjectsTab();
                else if (tabName === 'profile') renderProfileTab();
                else if (tabName === 'dashboard') renderDashboard();
            } catch(err) {
                console.error('Error rendering tab:', tabName, err);
            }
        }
    }

    // Startup check if a user is currently logged in
    if (tcCurrentUser) {
        loadUserState(tcCurrentUser);
        
        // Hide login and open workspace
        loginScreen.style.display = 'none';
        appWorkspace.style.display = 'flex';
        
        // Apply saved visual accent theme
        document.body.className = `theme-${state.settings.theme || 'cyber'}`;
        
        // Launch onboarding wizard if they have zero subjects
        if (state.subjects.length === 0) {
            launchOnboardingWizard();
        } else {
            renderDashboard();
        }
    } else {
        // Block workspace and show login overlay
        loginScreen.style.display = 'flex';
        appWorkspace.style.display = 'none';
        document.body.className = "theme-cyber";
    }

});
