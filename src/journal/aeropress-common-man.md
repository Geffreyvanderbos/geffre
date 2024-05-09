---
title: Aeropress for the Common Man
date: 2024-05-01
---

This weekend Loki woke up much earlier than us, he was rustling and squeaking through the smallest living area you ever seen. Groggily we told him to settle. Instead, he started wagging his tail faster when he saw our pillow-creased faces peeking down from the loft. He was ready for the day and wondered why we weren't. I don't think the Tiny House was more than a couple of square meters big.

I clambered down the steepest stairs that should have been a ladder, poured the kibble in the dog bowl–which is not to Loki the Gourmet his liking–and turned on the water cooker for a nice cup of coffee.

The Aeropress is my favorite piece of coffee gear when I'm traveling. Making a proper cup of coffee with it is a process of trial and error. However, I think I figured it out and want to share it with you. This is *the Aeropress recipe for the common man*.

Here’s what you need: the Aeropress, an Aeropress filter, ground coffee, a water cooker, a coffee cup that is wide enough to fit the Aeropress, and something to stir with.

For lighter roasts use a fine grind similar to espresso. For darker roasts, opt for a coarser grind to reduce the extraction.

The steps: 

1. Boil the water and let it cool down in the cooker to between 85-90 degrees. (Takes 10 minutes on average with our off-the-shelf water-cooker.)
2. Put a scoop of ground coffee (≈26 grams) in the Aeropress with a filter installed.
3. Pour water quickly into the Aeropress to saturate the coffee grounds. Pour to about under the number 4 mark (≈200 milliliters).
4. Put the plunger in the Aeropress to create the vacuum which prevents liquid from dripping through the filter. Allow the coffee to steep for **2 minutes** (there’s a timer below this post).
5. After, perform a gentle swirl of the Aeropress—avoid creating a vortex. The grounds should start sinking to the bottom.
6. After a **30-second** pause, begin pressing down gently and steadily for about **30 seconds**.

A fresh cup of pleasant coffee is served. If your coffee is too bitter, consider a coarser grind or cooler. If sourness occurs, increase water temperature and grind the coffee finer.

As you can imagine, we felt a lot better after our caffeine addiction was satisfied. We soon left the tiny house and explored the forests on De Veluwe. If you ever get the chance to go to de Zanding in Otterlo, we can recommend it.

---

I've left these timers here in case you want to try out the recipe. They won't make any sound.

<div style="
    display: grid;
    grid-template-columns: 1fr 1fr;
    ">
    <div style="text-align: center;">
        <span id="timer1" style="font-weight: bold; font-size: 1.2rem;">120</span><br>
        <button onclick="startTimer('timer1', 120)">▶ Start</button>  
        <button onclick="resetTimer('timer1', 120)">↺ Reset</button>
    </div>
    <div style="text-align: center;">
        <span id="timer2" style="font-weight: bold; font-size: 1.2rem;">30</span><br>
        <button onclick="startTimer('timer2', 30)">▶ Start</button>
        <button onclick="resetTimer('timer2', 30)">↺ Reset</button>
    </div>
</div>

<script>
let timers = {};

function startTimer(id, time) {
    if (timers[id]) return;
    let counter = time;
    timers[id] = setInterval(() => {
        document.getElementById(id).innerText = --counter;
        if (counter === 0) {
            clearInterval(timers[id]);
            document.getElementById(id).classList.add('flash');
        }
    }, 1000);
}

function resetTimer(id, time) {
    clearInterval(timers[id]);
    timers[id] = null;
    document.getElementById(id).innerText = time;
    document.getElementById(id).classList.remove('flash');
}
</script>

<style>
.flash {
    animation: flash 1s linear infinite;
}

@keyframes flash {
    0%, 50%, 100% { color: red; }
    25%, 75% { color: black; }
}
</style>