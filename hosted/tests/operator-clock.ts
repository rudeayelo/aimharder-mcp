// Test-only wall-clock boundary for the real offline operator process.
const now=Date.now;const offset=Number(process.env.SYNTHETIC_CLOCK_OFFSET??0);Date.now=()=>now()+offset;
