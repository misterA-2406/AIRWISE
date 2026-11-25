Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft David Desktop")
$synth.Rate = 2

$outWav = "C:\Users\Alence\.gemini\antigravity\brain\4c5c807a-7aa0-4225-a15e-8c6d025145f1\scratch\voiceover_v2.wav"
$synth.SetOutputToWaveFile($outWav)

$ssml = @"
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <s>Every winter across South Asia and major cities worldwide, tens of millions of families wake up to toxic smog.</s>
  <break time="400ms"/>
  <s>Every weather app flashes the exact same red warning: AQI 380. Air is Hazardous. Stay indoors.</s>
  <break time="350ms"/>
  <s>But real life cannot stop. People must commute to work, care for aging parents, and send kids to school.</s>
  <break time="400ms"/>
  <s>Static numbers don't protect people. Practical decisions do.</s>
  <break time="350ms"/>
  <s>Watch right here on our landing page: instead of blind exposure, AIRWISE shows the original day alongside an adapted schedule, shifting high exertion routines out of peak inversion hours.</s>
  <break time="400ms"/>
  <s>This is AIRWISE: personal air intelligence that transforms pollution data into concrete, low-emission daily adaptation.</s>
  <break time="700ms"/>

  <s>Here is the Overview Dashboard. It isn't a chaotic sea of charts. It is an intelligent morning briefing built around four critical questions.</s>
  <break time="350ms"/>
  <s>First: how is the air right now? Second: what is your single highest priority decision today?</s>
  <break time="400ms"/>
  <s>Here, our engine flags a severe ground-level temperature inversion trapping diesel exhaust at 6 PM, advising you to shift outdoor cardio indoors.</s>
  <break time="450ms"/>
  <s>Now, how does AIRWISE personalize this? Through a dual-engine architecture.</s>
  <break time="300ms"/>
  <s>First: hyperlocal environmental telemetry: boundary layer height and diurnal inversion curves from Copernicus CAMS.</s>
  <break time="300ms"/>
  <s>Second: your lifestyle profile: your specific commute mode, whether you have asthmatic kids or elderly parents at home, and your budget constraints.</s>
  <break time="450ms"/>
  <s>We even built a dual-view mode: simple, plain-English guidance for busy parents, or full atmospheric physics for researchers.</s>
  <break time="300ms"/>
  <s>With one tap, we enact today's safeguard into our routine.</s>
  <break time="700ms"/>

  <s>Now, let's step into our signature feature: the What-If Decision Lab.</s>
  <break time="450ms"/>
  <s>Most people suspect that taking public transit is better, but they never see the concrete trade-offs.</s>
  <break time="350ms"/>
  <s>The What-If Lab lets users compare two daily decisions side-by-side before committing to them.</s>
  <break time="450ms"/>
  <s>Look at the Delta Verdict. It immediately calculates both personal and environmental consequences: a 68 percent reduction in lung exposure, monthly fuel savings of 1,400 rupees, and nearly three kilograms of greenhouse gas emissions eliminated, calculated using verified IPCC 2021 urban transit factors, not hallucinated AI numbers.</s>
  <break time="450ms"/>
  <s>Watch the math adapt in real-time as I adjust the commute distance and local inversion severity.</s>
  <break time="350ms"/>
  <s>The physics model proves exactly why taking the filtered Metro saves your lungs and the planet.</s>
  <break time="350ms"/>
  <s>One click, and this cleaner decision is applied directly to today's schedule.</s>
  <break time="700ms"/>

  <s>Next is the Indoor Air Coach. During winter smog, indoor air is often three to five times more toxic than outdoor air due to unvented cooking, mosquito coils, and trapped dust.</s>
  <break time="450ms"/>
  <s>Telling a working-class family to go buy a 500-dollar air purifier is disconnected from reality. That's why AIRWISE features a dedicated Zero-Budget Mode.</s>
  <break time="450ms"/>
  <s>Every recommendation here costs zero rupees. Simple behavioral physics, like pre-exhausting the kitchen before frying, damp-mopping instead of dry-sweeping, or using a damp towel on window sills, slashes indoor particulate spikes without spending a dime.</s>
  <break time="450ms"/>
  <s>Families check off in-home pollution sources to reveal customized mitigation protocols.</s>
  <break time="700ms"/>

  <s>Behind all of this is our grounded AI Copilot. Unlike generic chatbots, it is route-aware: it sees which screen you are on and tailors its reasoning to your current decision.</s>
  <break time="450ms"/>
  <s>It provides actionable advice backed by WHO guidelines. Even better, it generates interactive Routine Change Proposals.</s>
  <break time="450ms"/>
  <s>With one click, the AI directly modifies your daily routine in state, with full undo control.</s>
  <break time="600ms"/>
  <s>We cannot clean urban air overnight. But with AIRWISE, we give families the personal intelligence to adapt their day, protect their loved ones, and collectively cut emissions.</s>
  <break time="400ms"/>
  <s>Thank you.</s>
</speak>
"@

$synth.SpeakSsml($ssml)
$synth.Dispose()
Write-Host "Voiceover synthesis complete: $outWav"
