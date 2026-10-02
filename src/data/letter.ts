/**
 * The birthday letter — rendered as real HTML text and typed on the paper.
 * DO NOT EDIT the wording, punctuation, spacing or emoji: this is the approved message.
 * (Line 1 intentionally contains two spaces after «Սիրելի՛».)
 */
export const letterLines: readonly string[] = [
  'Սիրելի՛  և Հարգելի Մարիամ ջան😀,',
  'Շնորհավոր ծնունդդ Լավ ու Տաղանդավոր Մարդ։',
  'Թող քո օրը լցված լինի ջերմությամբ, ժպիտներով և ամենագեղեցիկ զգացումներով։',
  'Մաղթում եմ, որ միշտ ստեղծագործես նույն սիրով, ներշնչանքով ու գեղեցկությամբ, որով լուսավորում ես շրջապատդ։',
  'Թող քո կյանքում շատ լինեն երջանիկ պահերը, հաջողությունները և սրտից եկող ուրախությունները։',
  'Մնա միշտ նույն լուսավոր, բարի ու յուրահատուկ մարդը։',
];

/** Typewriter timing (Animation-Spec.md → Letter; brief: 30–45 ms per character). */
export const typewriter = {
  charDelay: 36,
  /** extra jitter so the rhythm feels hand-typed, not mechanical */
  jitter: 8,
  /** pause after the greeting line */
  greetingPause: 350,
  /** small pause between the following lines */
  linePause: 260,
  /** micro pause after commas */
  commaPause: 90,
  /** section must be this visible before typing starts ("enters at 20% viewport") */
  startThreshold: 0.2,
} as const;
