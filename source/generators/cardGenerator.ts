import { Card } from "../act1/types";

interface CardGenerator {
  generate(card: Card): Buffer;
  generateBack(): Buffer;
  requiredFiles?(): string[]
}

export { CardGenerator }
