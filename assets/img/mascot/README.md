# Mascot frames (temporary animation test)

Drop the two transparent PNGs here, with these exact filenames:

- `ChatGPT Image Sep 2, 2026, 06_02_38 PM.png`  — default / idle frame
- `frame-04-look-left.png`                      — hover frame (looking left)

They are referenced from `assets/js/mascot-test.js` (URL-encoded, since the
first filename contains spaces and commas). Both frames should share the same
canvas size and the same character position so the crossfade does not shift.

This whole folder is part of the temporary mascot test and can be deleted
together with `assets/css/mascot-test.css` and `assets/js/mascot-test.js`.
