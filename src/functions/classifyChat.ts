import fs from "fs";
import path from "path";

export type ChatClass = 
  | "Punch" 
  | "Crouch" 
  | "Walk Forward" 
  | "Step Back" 
  | "Guard" 
  | "Punch Up" 
  | "other";

const CONF_THRESHOLD = 0.5;

/**
 * Load model parameters from JSON file.
 * Contents:
 *  - vocab: Record<string, number>
 *  - idf: number[]
 *  - classes: string[]
 *  - W: number[][]
 *  - b: number[]
 */
const modelPath = path.join(process.cwd(), "src", "model", "chat_model.json");
const model = JSON.parse(fs.readFileSync(modelPath, "utf-8"));

const vocab: Record<string, number> = model.vocab;
const idf: number[] = model.idf;
const classes: string[] = model.classes;
const W: number[][] = model.W;
const b: number[] = model.b;

/**
 * Convert input text into a TF-IDF feature vector.
 *
 * Input type:
 *    text: string
 *
 * Output type:
 *    number[]  (TF-IDF feature vector)
 */
function vectorize(text: string): number[] {
  const tokens = text.toLowerCase().split("");
  const features = new Array(idf.length).fill(0);

  // Extract n-gram features (2–4 characters) — same as Python model
  for (let n = 2; n <= 4; n++) {
    for (let i = 0; i <= tokens.length - n; i++) {
      const gram = tokens.slice(i, i + n).join("");
      const idx = vocab[gram];
      if (idx !== undefined) {
        features[idx] += 1;
      }
    }
  }

  // Apply TF-IDF weighting
  return features.map((tf, i) => tf * idf[i]);
}

/**
 * Predict a class label using linear SVM parameters.
 *
 * Input type:
 *    vec: number[]  (TF-IDF feature vector)
 *
 * Output type:
 *    ChatClass  ("attack" | "defence" | "jump" | "other")
 */
function predictLabel(vec: number[]): ChatClass {
  let bestClass = "other" as ChatClass;
  let bestScore = -Infinity;

  // Compute classification scores for each class
  for (let c = 0; c < classes.length; c++) {
    const score =
      W[c].reduce((sum, w_i, i) => sum + w_i * vec[i], 0) + b[c];

    if (score > bestScore) {
      bestScore = score;
      bestClass = classes[c] as ChatClass;
    }
  }

  // Apply confidence threshold
  if (bestScore < CONF_THRESHOLD) return "other";

  return bestClass;
}

/**
 * Main classification function.
 *
 * Input type:
 *    text: string
 *
 * Output type:
 *    ChatClass  ("attack" | "defence" | "jump" | "other")
 *
 * Description:
 *    Converts input text to TF-IDF vector → applies SVM → returns class name.
 */
export function classifyChat(text: string): ChatClass {
  const vec = vectorize(text);
  return predictLabel(vec);
}
