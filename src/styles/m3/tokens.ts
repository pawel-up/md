import { css } from 'lit'

export default css`
  html {
    /* light */
    /* Custom */
    --md-sys-color-primary-light-05a: rgba(0 104 116, 0.05);
    --md-sys-color-primary-light-08a: rgba(0 104 116, 0.08);
    --md-sys-color-primary-light-11a: rgba(0 104 116, 0.11);
    --md-sys-color-primary-light-12a: rgba(0 104 116, 0.12);
    --md-sys-color-primary-light-13a: rgba(0 104 116, 0.13);
    /* M3 Generated */
    --md-sys-color-primary-light: rgb(0 104 116);
    --md-sys-color-surface-tint-light: rgb(0 104 116);
    --md-sys-color-on-primary-light: rgb(255 255 255);
    --md-sys-color-primary-container-light: rgb(158 239 254);
    --md-sys-color-on-primary-container-light: rgb(0 79 88);
    --md-sys-color-secondary-light: rgb(74 98 103);
    --md-sys-color-on-secondary-light: rgb(255 255 255);
    --md-sys-color-secondary-container-light: rgb(205 231 236);
    --md-sys-color-on-secondary-container-light: rgb(51 75 79);
    --md-sys-color-tertiary-light: rgb(83 94 125);
    --md-sys-color-on-tertiary-light: rgb(255 255 255);
    --md-sys-color-tertiary-container-light: rgb(218 226 255);
    --md-sys-color-on-tertiary-container-light: rgb(59 70 101);
    --md-sys-color-error-light: rgb(186 26 26);
    --md-sys-color-on-error-light: rgb(255 255 255);
    --md-sys-color-error-container-light: rgb(255 218 214);
    --md-sys-color-on-error-container-light: rgb(147 0 10);
    --md-sys-color-background-light: rgb(245 250 251);
    --md-sys-color-on-background-light: rgb(23 29 30);
    --md-sys-color-surface-light: rgb(245 250 251);
    --md-sys-color-on-surface-light: rgb(23 29 30);
    --md-sys-color-surface-variant-light: rgb(219 228 230);
    --md-sys-color-on-surface-variant-light: rgb(63 72 74);
    --md-sys-color-outline-light: rgb(111 121 123);
    --md-sys-color-outline-variant-light: rgb(191 200 202);
    --md-sys-color-shadow-light: rgb(0 0 0);
    --md-sys-color-scrim-light: rgb(0 0 0);
    --md-sys-color-inverse-surface-light: rgb(43 49 51);
    --md-sys-color-inverse-on-surface-light: rgb(236 242 243);
    --md-sys-color-inverse-primary-light: rgb(130 211 225);
    --md-sys-color-primary-fixed-light: rgb(158 239 254);
    --md-sys-color-on-primary-fixed-light: rgb(0 31 36);
    --md-sys-color-primary-fixed-dim-light: rgb(130 211 225);
    --md-sys-color-on-primary-fixed-variant-light: rgb(0 79 88);
    --md-sys-color-secondary-fixed-light: rgb(205 231 236);
    --md-sys-color-on-secondary-fixed-light: rgb(5 31 35);
    --md-sys-color-secondary-fixed-dim-light: rgb(177 203 208);
    --md-sys-color-on-secondary-fixed-variant-light: rgb(51 75 79);
    --md-sys-color-tertiary-fixed-light: rgb(218 226 255);
    --md-sys-color-on-tertiary-fixed-light: rgb(15 26 55);
    --md-sys-color-tertiary-fixed-dim-light: rgb(187 198 234);
    --md-sys-color-on-tertiary-fixed-variant-light: rgb(59 70 101);
    --md-sys-color-surface-dim-light: rgb(213 219 220);
    --md-sys-color-surface-bright-light: rgb(245 250 251);
    --md-sys-color-surface-container-lowest-light: rgb(255 255 255);
    --md-sys-color-surface-container-low-light: rgb(239 245 246);
    --md-sys-color-surface-container-light: rgb(233 239 240);
    --md-sys-color-surface-container-high-light: rgb(227 233 234);
    --md-sys-color-surface-container-highest-light: rgb(222 227 229);

    /* light high contrast */
    /* Custom */
    --md-sys-color-primary-light-hc-05a: rgba(0 49 56, 0.05);
    --md-sys-color-primary-light-hc-08a: rgba(0 49 56, 0.08);
    --md-sys-color-primary-light-hc-11a: rgba(0 49 56, 0.11);
    --md-sys-color-primary-light-hc-12a: rgba(0 49 56, 0.12);
    --md-sys-color-primary-light-hc-13a: rgba(0 49 56, 0.13);
    /* M3 Generated */
    --md-sys-color-primary-light-hc: rgb(0 49 56);
    --md-sys-color-surface-tint-light-hc: rgb(0 104 116);
    --md-sys-color-on-primary-light-hc: rgb(255 255 255);
    --md-sys-color-primary-container-light-hc: rgb(0 81 91);
    --md-sys-color-on-primary-container-light-hc: rgb(255 255 255);
    --md-sys-color-secondary-light-hc: rgb(23 48 52);
    --md-sys-color-on-secondary-light-hc: rgb(255 255 255);
    --md-sys-color-secondary-container-light-hc: rgb(53 77 81);
    --md-sys-color-on-secondary-container-light-hc: rgb(255 255 255);
    --md-sys-color-tertiary-light-hc: rgb(32 43 72);
    --md-sys-color-on-tertiary-light-hc: rgb(255 255 255);
    --md-sys-color-tertiary-container-light-hc: rgb(61 72 103);
    --md-sys-color-on-tertiary-container-light-hc: rgb(255 255 255);
    --md-sys-color-error-light-hc: rgb(96 0 4);
    --md-sys-color-on-error-light-hc: rgb(255 255 255);
    --md-sys-color-error-container-light-hc: rgb(152 0 10);
    --md-sys-color-on-error-container-light-hc: rgb(255 255 255);
    --md-sys-color-background-light-hc: rgb(245 250 251);
    --md-sys-color-on-background-light-hc: rgb(23 29 30);
    --md-sys-color-surface-light-hc: rgb(245 250 251);
    --md-sys-color-on-surface-light-hc: rgb(0 0 0);
    --md-sys-color-surface-variant-light-hc: rgb(219 228 230);
    --md-sys-color-on-surface-variant-light-hc: rgb(0 0 0);
    --md-sys-color-outline-light-hc: rgb(37 46 47);
    --md-sys-color-outline-variant-light-hc: rgb(66 75 77);
    --md-sys-color-shadow-light-hc: rgb(0 0 0);
    --md-sys-color-scrim-light-hc: rgb(0 0 0);
    --md-sys-color-inverse-surface-light-hc: rgb(43 49 51);
    --md-sys-color-inverse-on-surface-light-hc: rgb(255 255 255);
    --md-sys-color-inverse-primary-light-hc: rgb(130 211 225);
    --md-sys-color-primary-fixed-light-hc: rgb(0 81 91);
    --md-sys-color-on-primary-fixed-light-hc: rgb(255 255 255);
    --md-sys-color-primary-fixed-dim-light-hc: rgb(0 57 64);
    --md-sys-color-on-primary-fixed-variant-light-hc: rgb(255 255 255);
    --md-sys-color-secondary-fixed-light-hc: rgb(53 77 81);
    --md-sys-color-on-secondary-fixed-light-hc: rgb(255 255 255);
    --md-sys-color-secondary-fixed-dim-light-hc: rgb(30 54 58);
    --md-sys-color-on-secondary-fixed-variant-light-hc: rgb(255 255 255);
    --md-sys-color-tertiary-fixed-light-hc: rgb(61 72 103);
    --md-sys-color-on-tertiary-fixed-light-hc: rgb(255 255 255);
    --md-sys-color-tertiary-fixed-dim-light-hc: rgb(39 50 79);
    --md-sys-color-on-tertiary-fixed-variant-light-hc: rgb(255 255 255);
    --md-sys-color-surface-dim-light-hc: rgb(180 186 187);
    --md-sys-color-surface-bright-light-hc: rgb(245 250 251);
    --md-sys-color-surface-container-lowest-light-hc: rgb(255 255 255);
    --md-sys-color-surface-container-low-light-hc: rgb(236 242 243);
    --md-sys-color-surface-container-light-hc: rgb(222 227 229);
    --md-sys-color-surface-container-high-light-hc: rgb(208 213 215);
    --md-sys-color-surface-container-highest-light-hc: rgb(194 199 201);
    /* light medium contrast */
    /* Custom */
    --md-sys-color-primary-light-mc-05a: rgba(0 60 68, 0.05);
    --md-sys-color-primary-light-mc-08a: rgba(0 60 68, 0.08);
    --md-sys-color-primary-light-mc-11a: rgba(0 60 68, 0.11);
    --md-sys-color-primary-light-mc-12a: rgba(0 60 68, 0.12);
    --md-sys-color-primary-light-mc-13a: rgba(0 60 68, 0.13);
    /* M3 Generated */
    --md-sys-color-primary-light-mc: rgb(0 60 68);
    --md-sys-color-surface-tint-light-mc: rgb(0 104 116);
    --md-sys-color-on-primary-light-mc: rgb(255 255 255);
    --md-sys-color-primary-container-light-mc: rgb(25 120 133);
    --md-sys-color-on-primary-container-light-mc: rgb(255 255 255);
    --md-sys-color-secondary-light-mc: rgb(34 58 62);
    --md-sys-color-on-secondary-light-mc: rgb(255 255 255);
    --md-sys-color-secondary-container-light-mc: rgb(89 113 118);
    --md-sys-color-on-secondary-container-light-mc: rgb(255 255 255);
    --md-sys-color-tertiary-light-mc: rgb(42 53 83);
    --md-sys-color-on-tertiary-light-mc: rgb(255 255 255);
    --md-sys-color-tertiary-container-light-mc: rgb(97 108 141);
    --md-sys-color-on-tertiary-container-light-mc: rgb(255 255 255);
    --md-sys-color-error-light-mc: rgb(116 0 6);
    --md-sys-color-on-error-light-mc: rgb(255 255 255);
    --md-sys-color-error-container-light-mc: rgb(207 44 39);
    --md-sys-color-on-error-container-light-mc: rgb(255 255 255);
    --md-sys-color-background-light-mc: rgb(245 250 251);
    --md-sys-color-on-background-light-mc: rgb(23 29 30);
    --md-sys-color-surface-light-mc: rgb(245 250 251);
    --md-sys-color-on-surface-light-mc: rgb(12 18 19);
    --md-sys-color-surface-variant-light-mc: rgb(219 228 230);
    --md-sys-color-on-surface-variant-light-mc: rgb(47 56 57);
    --md-sys-color-outline-light-mc: rgb(75 84 86);
    --md-sys-color-outline-variant-light-mc: rgb(101 111 113);
    --md-sys-color-shadow-light-mc: rgb(0 0 0);
    --md-sys-color-scrim-light-mc: rgb(0 0 0);
    --md-sys-color-inverse-surface-light-mc: rgb(43 49 51);
    --md-sys-color-inverse-on-surface-light-mc: rgb(236 242 243);
    --md-sys-color-inverse-primary-light-mc: rgb(130 211 225);
    --md-sys-color-primary-fixed-light-mc: rgb(25 120 133);
    --md-sys-color-on-primary-fixed-light-mc: rgb(255 255 255);
    --md-sys-color-primary-fixed-dim-light-mc: rgb(0 94 105);
    --md-sys-color-on-primary-fixed-variant-light-mc: rgb(255 255 255);
    --md-sys-color-secondary-fixed-light-mc: rgb(89 113 118);
    --md-sys-color-on-secondary-fixed-light-mc: rgb(255 255 255);
    --md-sys-color-secondary-fixed-dim-light-mc: rgb(65 89 93);
    --md-sys-color-on-secondary-fixed-variant-light-mc: rgb(255 255 255);
    --md-sys-color-tertiary-fixed-light-mc: rgb(97 108 141);
    --md-sys-color-on-tertiary-fixed-light-mc: rgb(255 255 255);
    --md-sys-color-tertiary-fixed-dim-light-mc: rgb(73 84 115);
    --md-sys-color-on-tertiary-fixed-variant-light-mc: rgb(255 255 255);
    --md-sys-color-surface-dim-light-mc: rgb(194 199 201);
    --md-sys-color-surface-bright-light-mc: rgb(245 250 251);
    --md-sys-color-surface-container-lowest-light-mc: rgb(255 255 255);
    --md-sys-color-surface-container-low-light-mc: rgb(239 245 246);
    --md-sys-color-surface-container-light-mc: rgb(227 233 234);
    --md-sys-color-surface-container-high-light-mc: rgb(216 222 223);
    --md-sys-color-surface-container-highest-light-mc: rgb(205 211 212);

    /* dark */
    /* Custom */
    --md-sys-color-primary-dark-05a: rgba(130 211 225, 0.05);
    --md-sys-color-primary-dark-08a: rgba(130 211 225, 0.08);
    --md-sys-color-primary-dark-11a: rgba(130 211 225, 0.11);
    --md-sys-color-primary-dark-12a: rgba(130 211 225, 0.12);
    --md-sys-color-primary-dark-13a: rgba(130 211 225, 0.13);

    /* M3 Generated */
    --md-sys-color-primary-dark: rgb(130 211 225);
    --md-sys-color-surface-tint-dark: rgb(130 211 225);
    --md-sys-color-on-primary-dark: rgb(0 54 61);
    --md-sys-color-primary-container-dark: rgb(0 79 88);
    --md-sys-color-on-primary-container-dark: rgb(158 239 254);
    --md-sys-color-secondary-dark: rgb(177 203 208);
    --md-sys-color-on-secondary-dark: rgb(28 52 56);
    --md-sys-color-secondary-container-dark: rgb(51 75 79);
    --md-sys-color-on-secondary-container-dark: rgb(205 231 236);
    --md-sys-color-tertiary-dark: rgb(187 198 234);
    --md-sys-color-on-tertiary-dark: rgb(36 48 77);
    --md-sys-color-tertiary-container-dark: rgb(59 70 101);
    --md-sys-color-on-tertiary-container-dark: rgb(218 226 255);
    --md-sys-color-error-dark: rgb(255 180 171);
    --md-sys-color-on-error-dark: rgb(105 0 5);
    --md-sys-color-error-container-dark: rgb(147 0 10);
    --md-sys-color-on-error-container-dark: rgb(255 218 214);
    --md-sys-color-background-dark: rgb(14 20 21);
    --md-sys-color-on-background-dark: rgb(222 227 229);
    --md-sys-color-surface-dark: rgb(14 20 21);
    --md-sys-color-on-surface-dark: rgb(222 227 229);
    --md-sys-color-surface-variant-dark: rgb(63 72 74);
    --md-sys-color-on-surface-variant-dark: rgb(191 200 202);
    --md-sys-color-outline-dark: rgb(137 146 148);
    --md-sys-color-outline-variant-dark: rgb(63 72 74);
    --md-sys-color-shadow-dark: rgb(0 0 0);
    --md-sys-color-scrim-dark: rgb(0 0 0);
    --md-sys-color-inverse-surface-dark: rgb(222 227 229);
    --md-sys-color-inverse-on-surface-dark: rgb(43 49 51);
    --md-sys-color-inverse-primary-dark: rgb(0 104 116);
    --md-sys-color-primary-fixed-dark: rgb(158 239 254);
    --md-sys-color-on-primary-fixed-dark: rgb(0 31 36);
    --md-sys-color-primary-fixed-dim-dark: rgb(130 211 225);
    --md-sys-color-on-primary-fixed-variant-dark: rgb(0 79 88);
    --md-sys-color-secondary-fixed-dark: rgb(205 231 236);
    --md-sys-color-on-secondary-fixed-dark: rgb(5 31 35);
    --md-sys-color-secondary-fixed-dim-dark: rgb(177 203 208);
    --md-sys-color-on-secondary-fixed-variant-dark: rgb(51 75 79);
    --md-sys-color-tertiary-fixed-dark: rgb(218 226 255);
    --md-sys-color-on-tertiary-fixed-dark: rgb(15 26 55);
    --md-sys-color-tertiary-fixed-dim-dark: rgb(187 198 234);
    --md-sys-color-on-tertiary-fixed-variant-dark: rgb(59 70 101);
    --md-sys-color-surface-dim-dark: rgb(14 20 21);
    --md-sys-color-surface-bright-dark: rgb(52 58 59);
    --md-sys-color-surface-container-lowest-dark: rgb(9 15 16);
    --md-sys-color-surface-container-low-dark: rgb(23 29 30);
    --md-sys-color-surface-container-dark: rgb(27 33 34);
    --md-sys-color-surface-container-high-dark: rgb(37 43 44);
    --md-sys-color-surface-container-highest-dark: rgb(48 54 55);

    /* dark high contrast */
    /* Custom */
    --md-sys-color-primary-dark-hc-05a: rgba(206 247 255, 0.05);
    --md-sys-color-primary-dark-hc-08a: rgba(206 247 255, 0.08);
    --md-sys-color-primary-dark-hc-11a: rgba(206 247 255, 0.11);
    --md-sys-color-primary-dark-hc-12a: rgba(206 247 255, 0.12);
    --md-sys-color-primary-dark-hc-13a: rgba(206 247 255, 0.13);
    /* M3 Generated */
    --md-sys-color-primary-dark-hc: rgb(206 247 255);
    --md-sys-color-surface-tint-dark-hc: rgb(130 211 225);
    --md-sys-color-on-primary-dark-hc: rgb(0 0 0);
    --md-sys-color-primary-container-dark-hc: rgb(126 207 221);
    --md-sys-color-on-primary-container-dark-hc: rgb(0 14 16);
    --md-sys-color-secondary-dark-hc: rgb(218 245 250);
    --md-sys-color-on-secondary-dark-hc: rgb(0 0 0);
    --md-sys-color-secondary-container-dark-hc: rgb(173 199 204);
    --md-sys-color-on-secondary-container-dark-hc: rgb(0 14 16);
    --md-sys-color-tertiary-dark-hc: rgb(237 239 255);
    --md-sys-color-on-tertiary-dark-hc: rgb(0 0 0);
    --md-sys-color-tertiary-container-dark-hc: rgb(183 194 230);
    --md-sys-color-on-tertiary-container-dark-hc: rgb(0 9 38);
    --md-sys-color-error-dark-hc: rgb(255 236 233);
    --md-sys-color-on-error-dark-hc: rgb(0 0 0);
    --md-sys-color-error-container-dark-hc: rgb(255 174 164);
    --md-sys-color-on-error-container-dark-hc: rgb(34 0 1);
    --md-sys-color-background-dark-hc: rgb(14 20 21);
    --md-sys-color-on-background-dark-hc: rgb(222 227 229);
    --md-sys-color-surface-dark-hc: rgb(14 20 21);
    --md-sys-color-on-surface-dark-hc: rgb(255 255 255);
    --md-sys-color-surface-variant-dark-hc: rgb(63 72 74);
    --md-sys-color-on-surface-variant-dark-hc: rgb(255 255 255);
    --md-sys-color-outline-dark-hc: rgb(232 242 244);
    --md-sys-color-outline-variant-dark-hc: rgb(187 196 198);
    --md-sys-color-shadow-dark-hc: rgb(0 0 0);
    --md-sys-color-scrim-dark-hc: rgb(0 0 0);
    --md-sys-color-inverse-surface-dark-hc: rgb(222 227 229);
    --md-sys-color-inverse-on-surface-dark-hc: rgb(0 0 0);
    --md-sys-color-inverse-primary-dark-hc: rgb(0 80 89);
    --md-sys-color-primary-fixed-dark-hc: rgb(158 239 254);
    --md-sys-color-on-primary-fixed-dark-hc: rgb(0 0 0);
    --md-sys-color-primary-fixed-dim-dark-hc: rgb(130 211 225);
    --md-sys-color-on-primary-fixed-variant-dark-hc: rgb(0 20 23);
    --md-sys-color-secondary-fixed-dark-hc: rgb(205 231 236);
    --md-sys-color-on-secondary-fixed-dark-hc: rgb(0 0 0);
    --md-sys-color-secondary-fixed-dim-dark-hc: rgb(177 203 208);
    --md-sys-color-on-secondary-fixed-variant-dark-hc: rgb(0 20 23);
    --md-sys-color-tertiary-fixed-dark-hc: rgb(218 226 255);
    --md-sys-color-on-tertiary-fixed-dark-hc: rgb(0 0 0);
    --md-sys-color-tertiary-fixed-dim-dark-hc: rgb(187 198 234);
    --md-sys-color-on-tertiary-fixed-variant-dark-hc: rgb(4 16 44);
    --md-sys-color-surface-dim-dark-hc: rgb(14 20 21);
    --md-sys-color-surface-bright-dark-hc: rgb(75 81 82);
    --md-sys-color-surface-container-lowest-dark-hc: rgb(0 0 0);
    --md-sys-color-surface-container-low-dark-hc: rgb(27 33 34);
    --md-sys-color-surface-container-dark-hc: rgb(43 49 51);
    --md-sys-color-surface-container-high-dark-hc: rgb(54 60 62);
    --md-sys-color-surface-container-highest-dark-hc: rgb(66 72 73);

    /* dark medium contrast */
    /* Custom */
    --md-sys-color-primary-dark-mc-05a: rgba(134 215 229, 0.05);
    --md-sys-color-primary-dark-mc-08a: rgba(134 215 229, 0.08);
    --md-sys-color-primary-dark-mc-11a: rgba(134 215 229, 0.11);
    --md-sys-color-primary-dark-mc-12a: rgba(134 215 229, 0.12);
    --md-sys-color-primary-dark-mc-13a: rgba(134 215 229, 0.13);
    /* M3 Generated */
    --md-sys-color-primary-dark-mc: rgb(152 233 247);
    --md-sys-color-surface-tint-dark-mc: rgb(130 211 225);
    --md-sys-color-on-primary-dark-mc: rgb(0 42 48);
    --md-sys-color-primary-container-dark-mc: rgb(73 156 169);
    --md-sys-color-on-primary-container-dark-mc: rgb(0 0 0);
    --md-sys-color-secondary-dark-mc: rgb(199 225 230);
    --md-sys-color-on-secondary-dark-mc: rgb(16 41 45);
    --md-sys-color-secondary-container-dark-mc: rgb(124 149 154);
    --md-sys-color-on-secondary-container-dark-mc: rgb(0 0 0);
    --md-sys-color-tertiary-dark-mc: rgb(209 219 255);
    --md-sys-color-on-tertiary-dark-mc: rgb(25 37 65);
    --md-sys-color-tertiary-container-dark-mc: rgb(133 144 178);
    --md-sys-color-on-tertiary-container-dark-mc: rgb(0 0 0);
    --md-sys-color-error-dark-mc: rgb(255 210 204);
    --md-sys-color-on-error-dark-mc: rgb(84 0 3);
    --md-sys-color-error-container-dark-mc: rgb(255 84 73);
    --md-sys-color-on-error-container-dark-mc: rgb(0 0 0);
    --md-sys-color-background-dark-mc: rgb(14 20 21);
    --md-sys-color-on-background-dark-mc: rgb(222 227 229);
    --md-sys-color-surface-dark-mc: rgb(14 20 21);
    --md-sys-color-on-surface-dark-mc: rgb(255 255 255);
    --md-sys-color-surface-variant-dark-mc: rgb(63 72 74);
    --md-sys-color-on-surface-variant-dark-mc: rgb(212 222 224);
    --md-sys-color-outline-dark-mc: rgb(170 180 181);
    --md-sys-color-outline-variant-dark-mc: rgb(136 146 148);
    --md-sys-color-shadow-dark-mc: rgb(0 0 0);
    --md-sys-color-scrim-dark-mc: rgb(0 0 0);
    --md-sys-color-inverse-surface-dark-mc: rgb(222 227 229);
    --md-sys-color-inverse-on-surface-dark-mc: rgb(37 43 44);
    --md-sys-color-inverse-primary-dark-mc: rgb(0 80 89);
    --md-sys-color-primary-fixed-dark-mc: rgb(158 239 254);
    --md-sys-color-on-primary-fixed-dark-mc: rgb(0 20 23);
    --md-sys-color-primary-fixed-dim-dark-mc: rgb(130 211 225);
    --md-sys-color-on-primary-fixed-variant-dark-mc: rgb(0 60 68);
    --md-sys-color-secondary-fixed-dark-mc: rgb(205 231 236);
    --md-sys-color-on-secondary-fixed-dark-mc: rgb(0 20 23);
    --md-sys-color-secondary-fixed-dim-dark-mc: rgb(177 203 208);
    --md-sys-color-on-secondary-fixed-variant-dark-mc: rgb(34 58 62);
    --md-sys-color-tertiary-fixed-dark-mc: rgb(218 226 255);
    --md-sys-color-on-tertiary-fixed-dark-mc: rgb(4 16 44);
    --md-sys-color-tertiary-fixed-dim-dark-mc: rgb(187 198 234);
    --md-sys-color-on-tertiary-fixed-variant-dark-mc: rgb(42 53 83);
    --md-sys-color-surface-dim-dark-mc: rgb(14 20 21);
    --md-sys-color-surface-bright-dark-mc: rgb(63 70 71);
    --md-sys-color-surface-container-lowest-dark-mc: rgb(4 8 9);
    --md-sys-color-surface-container-low-dark-mc: rgb(25 31 32);
    --md-sys-color-surface-container-dark-mc: rgb(35 41 42);
    --md-sys-color-surface-container-high-dark-mc: rgb(45 52 53);
    --md-sys-color-surface-container-highest-dark-mc: rgb(57 63 64);

    /* Typeface */
    --md-ref-typeface-brand: Roboto, system-ui, -apple-system, 'Segoe UI', Ubuntu, Cantarell, 'Noto Sans', sans-serif;

    --md-ref-typeface-weight-regular: 400;
    --md-ref-typeface-weight-medium: 500;
    --md-ref-typeface-weight-bold: 700;

    /* display - large */
    --md-sys-typescale-display-large-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-display-large-weight: var(--md-ref-typeface-weight-regular);
    --md-sys-typescale-display-large-size: 3.5625rem; /* 57pt */
    --md-sys-typescale-display-large-height: 4rem; /* 64pt */
    --md-sys-typescale-display-large-tracking: -0.25px;
    /* display - medium */
    --md-sys-typescale-display-medium-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-display-medium-weight: var(--md-ref-typeface-weight-regular);
    --md-sys-typescale-display-medium-size: 2.8125rem; /* 45pt */
    --md-sys-typescale-display-medium-height: 3.25rem; /* 52pt */
    --md-sys-typescale-display-medium-tracking: 0px;
    /* display - small */
    --md-sys-typescale-display-small-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-display-small-weight: var(--md-ref-typeface-weight-regular);
    --md-sys-typescale-display-small-size: 2.25rem; /* 36pt */
    --md-sys-typescale-display-small-height: 2.75rem; /* 44pt */
    --md-sys-typescale-display-small-tracking: 0px;
    /* headline - large */
    --md-sys-typescale-headline-large-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-headline-large-weight: var(--md-ref-typeface-weight-regular);
    --md-sys-typescale-headline-large-size: 2rem; /* 32pt */
    --md-sys-typescale-headline-large-height: 2.5rem; /* 40pt */
    --md-sys-typescale-headline-large-tracking: 0px;
    /* headline - medium */
    --md-sys-typescale-headline-medium-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-headline-medium-weight: var(--md-ref-typeface-weight-regular);
    --md-sys-typescale-headline-medium-size: 1.75rem; /* 28pt */
    --md-sys-typescale-headline-medium-height: 2.25rem; /* 36pt */
    --md-sys-typescale-headline-medium-tracking: 0px;
    /* headline - small */
    --md-sys-typescale-headline-small-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-headline-small-weight: var(--md-ref-typeface-weight-regular);
    --md-sys-typescale-headline-small-size: 1.5rem; /* 24pt */
    --md-sys-typescale-headline-small-height: 2rem; /* 32pt */
    --md-sys-typescale-headline-small-tracking: 0px;
    /* title - large */
    --md-sys-typescale-title-large-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-title-large-weight: var(--md-ref-typeface-weight-regular);
    --md-sys-typescale-title-large-size: 1.375rem; /* 22pt */
    --md-sys-typescale-title-large-height: 1.75rem; /* 28pt */
    --md-sys-typescale-title-large-tracking: 0px;
    /* title - medium */
    --md-sys-typescale-title-medium-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-title-medium-weight: var(--md-ref-typeface-weight-medium);
    --md-sys-typescale-title-medium-size: 1rem; /* 16pt */
    --md-sys-typescale-title-medium-height: 1.5rem; /* 24pt */
    --md-sys-typescale-title-medium-tracking: 0.15px;
    /* title - small */
    --md-sys-typescale-title-small-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-title-small-weight: var(--md-ref-typeface-weight-medium);
    --md-sys-typescale-title-small-size: 0.875rem; /* 14pt */
    --md-sys-typescale-title-small-height: 1.25rem; /* 20pt */
    --md-sys-typescale-title-small-tracking: 0.1px;
    /* body - large */
    --md-sys-typescale-body-large-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-body-large-weight: var(--md-ref-typeface-weight-regular);
    --md-sys-typescale-body-large-size: 1rem; /* 16pt */
    --md-sys-typescale-body-large-height: 1.5rem; /* 24pt */
    --md-sys-typescale-body-large-tracking: 0.5px;
    /* body - medium */
    --md-sys-typescale-body-medium-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-body-medium-weight: var(--md-ref-typeface-weight-regular);
    --md-sys-typescale-body-medium-size: 0.875rem; /* 14pt */
    --md-sys-typescale-body-medium-height: 1.25rem; /* 20pt */
    --md-sys-typescale-body-medium-tracking: 0.25px;
    /* body - small */
    --md-sys-typescale-body-small-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-body-small-weight: var(--md-ref-typeface-weight-regular);
    --md-sys-typescale-body-small-size: 0.75rem; /* 12pt */
    --md-sys-typescale-body-small-height: 1rem; /* 16pt */
    --md-sys-typescale-body-small-tracking: 0.4px;
    /* label - large */
    --md-sys-typescale-label-large-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-label-large-weight: var(--md-ref-typeface-weight-medium);
    --md-sys-typescale-label-large-weight-prominent: var(--md-ref-typeface-weight-bold);
    --md-sys-typescale-label-large-size: 0.875rem; /* 14pt */
    --md-sys-typescale-label-large-height: 1.25rem; /* 20pt */
    --md-sys-typescale-label-large-tracking: 0.1px;
    /* label - medium */
    --md-sys-typescale-label-medium-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-label-medium-weight: var(--md-ref-typeface-weight-medium);
    --md-sys-typescale-label-medium-weight-prominent: var(--md-ref-typeface-weight-bold);
    --md-sys-typescale-label-medium-size: 0.75rem; /* 12pt */
    --md-sys-typescale-label-medium-height: 1rem; /* 16pt */
    --md-sys-typescale-label-medium-tracking: 0.5px;
    /* label - small */
    --md-sys-typescale-label-small-font: var(--md-ref-typeface-brand);
    --md-sys-typescale-label-small-weight: var(--md-ref-typeface-weight-medium);
    --md-sys-typescale-label-small-size: 0.6875rem; /* 11pt */
    --md-sys-typescale-label-small-height: 1rem; /* 16pt */
    --md-sys-typescale-label-small-tracking: 0.5px;

    /* CUSTOM!!! */

    /* Elevation light */
    --md-sys-elevation-1-light: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    --md-sys-elevation-2-light: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
    --md-sys-elevation-3-light: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
    --md-sys-elevation-4-light: 0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3);
    --md-sys-elevation-5-light: 0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3);
    /* Elevation dark */
    --md-sys-elevation-1-dark: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3);
    --md-sys-elevation-2-dark: 0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3);
    --md-sys-elevation-3-dark: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
    --md-sys-elevation-4-dark: 0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3);
    --md-sys-elevation-5-dark: 0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3);
    /* State layer */
    --md-sys-state-hover-state-layer-opacity: 0.08;
    --md-sys-state-focus-state-layer-opacity: 0.1;
    --md-sys-state-pressed-state-layer-opacity: 0.1;
    --md-sys-state-dragged-state-layer-opacity: 0.16;
    /* Rounding */
    --md-sys-shape-corner-none: 0;
    --md-sys-shape-corner-extra-small: 4px;
    --md-sys-shape-corner-extra-small-top: 4px 4px 0px 0px;
    --md-sys-shape-corner-small: 8px;
    --md-sys-shape-corner-small-top: 8px 8px 0 0;
    --md-sys-shape-corner-small-bottom: 0 0 8px 8px;
    --md-sys-shape-corner-medium: 12px;
    --md-sys-shape-corner-medium-top: 12px 12px 0 0;
    --md-sys-shape-corner-large: 16px;
    --md-sys-shape-corner-large-end: 0px 16px 16px 0px;
    --md-sys-shape-corner-large-top: 16px 16px 0px 0px;
    --md-sys-shape-corner-extra-large: 28px;
    --md-sys-shape-corner-extra-large-top: 28px 28px 0 0;
    --md-sys-shape-corner-full: 9999px;

    --md-sys-animation-easing-standard: cubic-bezier(0.2, 0, 0, 1);
    --md-sys-animation-easing-acceleration: cubic-bezier(0.4, 0, 1, 1);
    --md-sys-animation-easing-deceleration: cubic-bezier(0, 0, 0.2, 1);
    --md-sys-animation-easing-sharp: cubic-bezier(0.4, 0, 0.6, 1);

    /* Motion */
    --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
    --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
    --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
    --md-sys-motion-easing-standard-decelerate: cubic-bezier(0, 0, 0, 1);
    --md-sys-motion-easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);
    --md-sys-motion-duration-short1: 50ms;
    --md-sys-motion-duration-short2: 100ms;
    --md-sys-motion-duration-short3: 150ms;
    --md-sys-motion-duration-short4: 200ms;
    --md-sys-motion-duration-medium1: 250ms;
    --md-sys-motion-duration-medium2: 300ms;
    --md-sys-motion-duration-medium3: 350ms;
    --md-sys-motion-duration-medium4: 400ms;
    --md-sys-motion-duration-long1: 450ms;
    --md-sys-motion-duration-long2: 500ms;
    --md-sys-motion-duration-long3: 550ms;
    --md-sys-motion-duration-long4: 600ms;
    --md-sys-motion-duration-extra-long1: 700ms;
    --md-sys-motion-duration-extra-long2: 800ms;
    --md-sys-motion-duration-extra-long3: 900ms;
    --md-sys-motion-duration-extra-long4: 1000ms;
  }
`
