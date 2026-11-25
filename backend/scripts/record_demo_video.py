import os
import time
import subprocess
from playwright.sync_api import sync_playwright
import imageio_ffmpeg

ARTIFACT_DIR = r"C:\Users\Alence\.gemini\antigravity\brain\4c5c807a-7aa0-4225-a15e-8c6d025145f1"
SCRATCH_DIR = os.path.join(ARTIFACT_DIR, "scratch")
VIDEO_TEMP_DIR = os.path.join(SCRATCH_DIR, "video_raw")
os.makedirs(VIDEO_TEMP_DIR, exist_ok=True)

# Clean out old raw webm files in temp dir
for f in os.listdir(VIDEO_TEMP_DIR):
    if f.endswith(".webm"):
        try:
            os.remove(os.path.join(VIDEO_TEMP_DIR, f))
        except:
            pass

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_URL = "http://127.0.0.1:5173"
AUDIO_PATH = os.path.join(SCRATCH_DIR, "voiceover.mp3")
FINAL_MP4_PATH = os.path.join(ARTIFACT_DIR, "AIRWISE_Product_Demo_Video.mp4")

def record_browser():
    print("Starting Playwright browser recording...")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=CHROME_PATH,
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--window-size=1920,1080"
            ]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=VIDEO_TEMP_DIR,
            record_video_size={"width": 1920, "height": 1080}
        )
        page = context.new_page()
        page.set_default_timeout(6000)

        # =========================================================
        # ACT 1: THE PROBLEM HOOK & INTERACTIVE DAY (0:00 - 0:38)
        # =========================================================
        print("ACT 1: Navigating to Landing Page...")
        page.goto(f"{BASE_URL}/", wait_until="networkidle")
        time.sleep(3.0)

        # Hero presence
        page.mouse.move(960, 420)
        time.sleep(4.0)
        page.mouse.move(1350, 380) # Atmospheric instrument
        time.sleep(3.5)

        # Smooth scroll to interactive "Original Day vs. AIRWISE-Adjusted Day" comparison
        print("Interacting with Landing Day Comparison...")
        for y in range(0, 950, 30):
            page.evaluate(f"window.scrollTo(0, {y})")
            time.sleep(0.04)
        time.sleep(3.0)

        # Click the comparison tabs
        try:
            # Click Original Schedule tab
            page.locator("button:has-text('Original Schedule')").first.click(timeout=3000)
            time.sleep(3.0)
            # Click Adapted View tab
            page.locator("button:has-text('Adapted View')").first.click(timeout=3000)
            time.sleep(3.0)
            # Click Side-by-Side tab
            page.locator("button:has-text('Side-by-Side')").first.click(timeout=3000)
            time.sleep(3.5)
        except Exception as e:
            print("Landing timeline tab click notice:", e)

        # Scroll down to philosophy
        for y in range(950, 1400, 35):
            page.evaluate(f"window.scrollTo(0, {y})")
            time.sleep(0.04)
        time.sleep(3.0)

        # Smoothly scroll back up to hero
        for y in range(1400, 0, -60):
            page.evaluate(f"window.scrollTo(0, {y})")
            time.sleep(0.03)
        time.sleep(2.0)

        # Click CTA to enter app
        try:
            cta = page.locator("a:has-text('Build my air plan'), a:has-text('Launch Overview')").first
            cta.click(timeout=3000)
            time.sleep(2.5)
        except:
            page.goto(f"{BASE_URL}/app", wait_until="networkidle")

        # =========================================================
        # ACT 2: DAILY BRIEFING & PERSONALIZATION (0:38 - 1:23)
        # =========================================================
        print("ACT 2: Overview Dashboard Briefing...")
        if page.url != f"{BASE_URL}/app":
            page.goto(f"{BASE_URL}/app", wait_until="networkidle")
        time.sleep(3.5)

        # Hover over live location badge
        page.mouse.move(400, 150)
        time.sleep(3.0)

        # Hover over 140px AQI circle
        page.mouse.move(500, 380)
        time.sleep(3.5)

        # Hover over Priority Daily Decision hero card
        page.mouse.move(1180, 320)
        time.sleep(3.5)

        # Demonstrate View Mode Toggle in top bar
        print("Toggling View Mode...")
        try:
            toggle_btn = page.locator("button:has-text('Detailed Air Science'), button:has-text('Simple View')").first
            toggle_btn.click(timeout=3000)
            time.sleep(3.5)
            # Click back to Simple View or toggle again
            toggle_btn.click(timeout=3000)
            time.sleep(3.0)
        except Exception as e:
            print("View mode toggle notice:", e)

        # Click View Alternative on hero card
        try:
            btn_alt = page.locator("button:has-text('View Alternative')").first
            btn_alt.click(timeout=3000)
            time.sleep(3.0)
        except Exception as e:
            print("Alt click notice:", e)

        # Click Enact Safeguard
        try:
            btn_enact = page.locator("button:has-text('Enact Safeguard')").first
            btn_enact.click(timeout=3000)
            time.sleep(3.5)
        except Exception as e:
            print("Enact click notice:", e)

        # Scroll down to Diurnal Timeline & Schedule
        for y in range(0, 550, 25):
            page.evaluate(f"window.scrollTo(0, {y})")
            time.sleep(0.04)
        time.sleep(4.0)

        # Scroll back to top
        for y in range(550, 0, -50):
            page.evaluate(f"window.scrollTo(0, {y})")
            time.sleep(0.03)
        time.sleep(2.0)

        # =========================================================
        # ACT 3: SIGNATURE WHAT-IF DECISION LAB (1:23 - 2:18)
        # =========================================================
        print("ACT 3: Navigating to What-If Decision Lab...")
        page.goto(f"{BASE_URL}/app/what-if", wait_until="networkidle")
        time.sleep(4.0)

        # Hover at Step 1 and Step 2 Options
        page.mouse.move(600, 320)
        time.sleep(3.5)

        # Hover at Illuminated Delta Verdict HUD
        page.mouse.move(960, 430)
        time.sleep(4.0)

        # Smoothly drag the Route Distance slider
        print("Interacting with Distance Slider...")
        try:
            slider = page.locator("input[type='range']").first
            slider.scroll_into_view_if_needed()
            time.sleep(1.0)
            box = slider.bounding_box()
            if box:
                start_x = box["x"] + box["width"] * 0.35
                y = box["y"] + box["height"] / 2
                page.mouse.move(start_x, y)
                page.mouse.down()
                for step in range(1, 16):
                    page.mouse.move(start_x + (box["width"] * 0.03 * step), y)
                    time.sleep(0.12)
                page.mouse.up()
                time.sleep(3.5)
        except Exception as e:
            print("Distance slider notice:", e)

        # Hover back to updated Delta HUD
        page.mouse.move(960, 420)
        time.sleep(3.5)

        # Adjust the Wind Inversion Slider
        print("Interacting with Wind Inversion Slider...")
        try:
            slider2 = page.locator("input[type='range']").nth(1)
            box2 = slider2.bounding_box()
            if box2:
                start_x = box2["x"] + box2["width"] * 0.5
                y = box2["y"] + box2["height"] / 2
                page.mouse.move(start_x, y)
                page.mouse.down()
                for step in range(1, 12):
                    page.mouse.move(start_x - (box2["width"] * 0.025 * step), y)
                    time.sleep(0.1)
                page.mouse.up()
                time.sleep(3.5)
        except Exception as e:
            print("Slider2 notice:", e)

        # Scroll to comparison and click Apply to Today's Plan
        for y in range(0, 420, 30):
            page.evaluate(f"window.scrollTo(0, {y})")
            time.sleep(0.04)
        time.sleep(2.0)

        try:
            page.locator("button:has-text(\"Apply to Today's Plan\")").first.click(timeout=3000)
            time.sleep(3.5)
        except Exception as e:
            print("Apply plan notice:", e)

        # =========================================================
        # ACT 4: INDOOR AIR COACH & ZERO-BUDGET HACKS (2:18 - 2:58)
        # =========================================================
        print("ACT 4: Navigating to Indoor Air Coach...")
        page.goto(f"{BASE_URL}/app/indoor", wait_until="networkidle")
        time.sleep(3.5)

        # Highlight Zero-Budget Mode Toggle & click it
        print("Toggling Zero-Budget Mode...")
        try:
            page.locator("button[aria-label='Toggle zero-budget mode']").click(timeout=3000)
            time.sleep(3.5)
        except Exception as e:
            print("Zero budget toggle notice:", e)

        # Scroll to Primary Hazard Banner with 2-min fix
        for y in range(0, 320, 25):
            page.evaluate(f"window.scrollTo(0, {y})")
            time.sleep(0.04)
        time.sleep(4.0)

        # Toggle an indoor source check
        try:
            page.locator("h4:has-text('Incense'), h3:has-text('Incense')").first.click(timeout=3000)
            time.sleep(3.0)
        except:
            pass

        # Scroll down to Zero-Cost protocols
        for y in range(320, 680, 30):
            page.evaluate(f"window.scrollTo(0, {y})")
            time.sleep(0.04)
        time.sleep(3.5)

        # =========================================================
        # ACT 5: ROUTE-AWARE AI COPILOT & 1-CLICK CHANGE (2:58 - 3:38)
        # =========================================================
        print("ACT 5: AI Copilot & Final Showcase...")
        page.evaluate("window.scrollTo(0, 0)")
        time.sleep(2.0)

        # Open AI Copilot drawer
        try:
            copilot_btn = page.locator("button:has-text('Ask Airwise Copilot')").first
            copilot_btn.click(timeout=3000)
            time.sleep(3.5)

            # Click contextual prompt pill
            prompt_btn = page.locator("button:has-text('Help me seal leaky single-pane windows')").first
            if prompt_btn.count() > 0:
                prompt_btn.click(timeout=3000)
            else:
                page.locator(".rounded-xl button, .space-y-2 button").first.click(timeout=3000)
            time.sleep(6.5)

            # Click Enact Routine Change on the AI proposal card
            enact_ai = page.locator("button:has-text('Enact Routine Change')").first
            if enact_ai.count() > 0:
                enact_ai.click(timeout=3000)
                time.sleep(3.5)

            # Close drawer cleanly via close button
            page.locator("button[aria-label='Close assistant']").first.click(timeout=3000)
            time.sleep(2.0)
        except Exception as e:
            print("Copilot drawer notice:", e)
            page.keyboard.press("Escape")

        time.sleep(2.0)

        # Return to Overview page for peaceful final holding shot
        print("Final returning shot on Overview Dashboard...")
        page.goto(f"{BASE_URL}/app", wait_until="networkidle")
        time.sleep(3.0)

        # Gentle final hold
        page.mouse.move(960, 500)
        time.sleep(8.0)

        print("Finished scenario execution. Closing browser context...")
        page.close()
        context.close()
        browser.close()

def mux_video_audio():
    print("Muxing video with audio using ffmpeg...")
    files = [os.path.join(VIDEO_TEMP_DIR, f) for f in os.listdir(VIDEO_TEMP_DIR) if f.endswith(".webm")]
    if not files:
        raise RuntimeError("No recorded video found in temp dir!")
    
    files.sort(key=os.path.getmtime, reverse=True)
    raw_video = files[0]
    print(f"Raw video recorded: {raw_video} ({os.path.getsize(raw_video)} bytes)")

    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", raw_video,
        "-i", AUDIO_PATH,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "21",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        FINAL_MP4_PATH
    ]
    
    print("Running ffmpeg command:", " ".join(cmd))
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        print("FFmpeg Error:", result.stderr)
        raise RuntimeError("FFmpeg muxing failed!")
    
    print(f"Successfully generated final product demo video: {FINAL_MP4_PATH}")
    print(f"Final video size: {os.path.getsize(FINAL_MP4_PATH)} bytes")

if __name__ == "__main__":
    record_browser()
    mux_video_audio()
