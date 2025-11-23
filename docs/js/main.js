/**
 * Myriad JS Application Main
 *
 * 2025-11-22
 */

// Track in ms the frequency to update
const interval = 1000;

// Define mod mask values; Used to ensure actions occur when detecting keyboard
// input when only specific conditions happen. (e.g. Shift+Alt+key is different
// than Shift+key)
const MM_SHIFT = 1;
const MM_ALT = 2;
const MM_CTRL = 4;

// Register the service worker
if ('serviceWorker' in navigator) {
    // Wait for the 'load' event to not block other work
    window.addEventListener('load', async () => {
        // Try to register the service worker.
        try {
            let reg = await navigator.serviceWorker.register('sw.js');
            console.log('Service worker registered! 😎', reg);
        } catch (err) {
            console.log('😥 Service worker registration failed: ', err);
        }
    });
}

const Myriad = {
    digits: [],
    process: null,
    init: function() {
        // Store the DOM element for the time display
        const time_element = document.getElementById("myriad_time");
        this.digits = time_element.getElementsByClassName("dv");


        this.step();
    },
    put_myriad_time: function(now) {
        const data_string = Math.floor(now / 1000) + '';
        for (let i = 0; i < data_string.length; i++) {
            this.digits[i].textContent = data_string[i];
        }
    },
    step: function() {
        // Accurate timing
        // Calculate when the next step should happen
        const now = Date.now();
        const next_step = interval - (now - Math.floor(now/1000) * 1000);

        // Paint the myriad time
        this.put_myriad_time(now);

        // Run activity process
        if (this.process) {
            this.process(now);
        }

        setTimeout(this.step.bind(this), next_step);
    },
    start_timer: function(duration) {
        const target_timer_time = parseInt(Date.now() / 1000) + duration;
        UI.activity_result.setAttribute('tooltip', 'Timer to ' + (target_timer_time / 10000).toFixed(4));
        this.process = function(now) {
            const result = target_timer_time - parseInt(now / 1000);
            UI.set_result((result / 10000).toFixed(4));
            if (result <= 0) {
                UI.warn();
            }
        };
        this.process(Date.now());
    },
};

const UI = {
    symbols: {ui_light: '☀', ui_dark: '☽'},
    activity: null,
    activity_result: null,
    datetime_options: {
        weekday: "short",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short"
    },
    datetime_utc_options: {
        weekday: "short",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "UTC",
        timeZoneName: "short"
    },
    init: function() {
        this.switch = document.getElementsByClassName('ui-switch')[0];
        this.btns = document.getElementsByClassName('ui-btn');
        this.forms = document.getElementsByClassName('ui-form');
        this.body = document.getElementsByTagName('body')[0];
        this.activity = document.getElementsByClassName('ui-activity')[0];
        this.activity_close = document.getElementsByClassName("ui-activity-close")[0];
        this.activity_result = document.getElementById("activity_result");

        this.bind();
        const mode = Cookie.get('ui-mode');
        if (mode) {
            this.set_mode(mode);
        }
    },
    bind: function() {
        const self = this;
        for (let elem of this.btns) {
            elem.addEventListener('click', function (event) {
                self.toggle_form(this.getAttribute('data'));
            }, false);
        }
        for (let elem of this.forms) {
            elem.addEventListener('submit', function (event) {
                event.preventDefault();
                self.submit_form(this);
            }, false);
        }
        this.activity_close.addEventListener('click', function (event) {
            self.stop_activity();
        });
        document.addEventListener('click', function (event) {
            if (!event.target.matches('.ui-switch')) return;
            event.preventDefault();
            self.toggle_mode();
        }, false);

        window.addEventListener('keyup', (e) => {
            const mod_mask = (e.shiftKey && MM_SHIFT) | (e.altKey && MM_ALT) | (e.ctrlKey && MM_CTRL);
            // console.log("Key", e.key, e.code, 'mod_mask', mod_mask, "Shift", e.shiftKey);
            if (e.key == "Escape") {
                self.hide_forms();
            }
            if (e.target.tagName == 'INPUT') {
                // If we are inside a text input, ignore
                return;
            }
            switch (e.key) {
                case '1': // passthru
                case 'd':
                    self.toggle_form('form-dt2m');
                    break;
                case '2': // passthru
                case 'm':
                    self.toggle_form('form-m2dt');
                    break;
                case '3': // passthru
                case 't':
                    self.toggle_form('form-timer');
                    break;
                case '4': // passthru
                case 'a':
                    self.toggle_form('form-alarm');
                    break;
                case 'x':
                    self.stop_activity();
                    break;
            }
        });
    },
    set_mode: function(mode) {
        this.body.className = mode;
        if (mode == 'ui-light') {
            this.switch.textContent = this.symbols.ui_light;
        } else {
            this.switch.textContent = this.symbols.ui_dark;
        }
        Cookie.set('ui-mode', mode);
    },
    toggle_mode: function() {
        var new_mode = (this.body.classList.contains('ui-light')) ? 'ui-dark' : 'ui-light';
        this.set_mode(new_mode);
    },
    toggle_form: function(name) {
        var formState = false; // Track whether target form is visible

        // Correctly show/hide the target form
        for (const form of this.forms) {
            if (form.classList.contains(name) && form.classList.contains('ui-hidden')) {
                formState = true;
                form.classList.remove('ui-hidden');
                form.getElementsByTagName('input')[0].focus();
            } else {
                form.classList.add('ui-hidden');
            }
        }

        // Correctly mark related button active
        for (const btn of this.btns) {
            if (btn.getAttribute('data') == name && formState) {
                btn.classList.add('ui-btn_active');
            } else {
                btn.classList.remove('ui-btn_active');
            }
        }
    },
    hide_forms: function() {
        for (const form of this.forms) {
            form.classList.add('ui-hidden');
        }
        for (const btn of this.btns) {
            btn.classList.remove('ui-btn_active');
        }
    },
    warn: function() {
        this.body.classList.add('ui-warn');
    },
    clear_warn: function() {
        this.body.classList.remove('ui-warn');
    },
    submit_form: function(form) {
        const action = form.getAttribute('data');
        const inputValue = form.getElementsByTagName('input')[0].value;
        switch (action) {
            case 'dt2m':
                this.calculate_dt2m(inputValue);
                break;
            case 'm2dt':
                this.calculate_m2dt(inputValue);
                break;
            case 'timer':
                this.create_timer(inputValue);
                break;
            case 'alarm':
                this.create_alarm(inputValue);
                break;
        }
    },
    calculate_dt2m: function(inputValue) {
        const answer_loc = document.getElementById('answer_m');
        const ts = Date.parse(inputValue);
        answer_loc.innerHTML = (ts / 1000 / 10000).toFixed(4);
        answer_loc.classList.remove('ui-hidden');
    },
    calculate_m2dt: function(inputValue) {
        const answer_loc = document.getElementById('answer_dt');
        const date = new Date(parseFloat(inputValue) * 10000 * 1000);
        answer_loc.innerHTML = `${date.toLocaleString('en-US', this.datetime_options)}<br />
            ${date.toLocaleString('UTC', this.datetime_utc_options)}`;
        answer_loc.classList.remove('ui-hidden');
    },
    create_timer: function(inputValue) {
        this.clear_warn();
        if (inputValue.endsWith('s')) {
            inputValue = parseFloat(inputValue.slice(0, -1)) / 10000;
        } else if (inputValue.endsWith('m')) {
            inputValue = (parseFloat(inputValue.slice(0, -1)) / 10000) * 60;
        }
        const duration = parseFloat(inputValue) * 10000;
        if (isNaN(duration)) {
            Myriad.process = null;
            return;
        }
        this.hide_forms();
        this.activity.classList.remove('ui-hidden');
        Myriad.start_timer(duration);
    },
    create_alarm: function(inputValue) {
        this.clear_warn();
        const targetMyriad = parseFloat(inputValue) * 10000;
        if (isNaN(targetMyriad)) {
            Myriad.process = null;
            return;
        }
        const duration = targetMyriad - parseInt(Date.now() / 1000);
        this.hide_forms();
        this.activity.classList.remove('ui-hidden');
        Myriad.start_timer(duration);
    },
    stop_activity: function() {
        Myriad.process = null;
        this.clear_warn();
        this.set_result('');
        this.activity.classList.add('ui-hidden');
    },
    set_result: function(value) {
        this.activity_result.textContent = value;
    }
}

window.addEventListener('load', async () => {
    Myriad.init();
    UI.init();
});

const Cookie = {
    set: function(name, value) {
        document.cookie = `${name}=${value}; max-age=${60 * 60 * 24 * 14};`;
    },
    get: function(name) {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
}
