# Dark Mode Fix Instructions

## The Problem
When you manually add `document.documentElement.classList.add('dark')` and nothing happens, it means Tailwind CSS is not generating the dark mode styles.

## Solution Steps

1. **STOP the dev server** (Ctrl+C in the terminal)

2. **Clear the Vite cache:**
   ```bash
   cd task2/frontend
   rm -rf node_modules/.vite
   ```
   Or on Windows PowerShell:
   ```powershell
   cd task2/frontend
   Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
   ```

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

4. **Hard refresh the browser:**
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open DevTools → Network tab → Check "Disable cache" → Refresh

5. **Test again:**
   - Open Console
   - Type: `document.documentElement.classList.add('dark')`
   - The page should turn dark immediately

## If it still doesn't work:

Check if Tailwind is processing the CSS:
1. Open DevTools → Network tab
2. Find `index.css` or the main CSS file
3. Click on it and check the Response
4. Search for "dark:" in the CSS - you should see dark mode styles

If you don't see dark mode styles in the CSS, Tailwind isn't processing them correctly.
