import "server-only";
import {
  evaluatePublishGate,
  type PublishableEntity,
  type PublishGateResult,
} from "@/lib/validation/publish-gate";
import { ValidationError } from "@/lib/errors";

export class PublishGateService {
  /**
   * Evaluates if an entity is eligible for public publication.
   */
  public evaluate(entity: PublishableEntity): PublishGateResult {
    return evaluatePublishGate(entity);
  }

  /**
   * Asserts that an entity is eligible for publication. Throws ValidationError if gate fails.
   */
  public assertCanPublish(entity: PublishableEntity): void {
    const result = this.evaluate(entity);
    if (!result.allowed) {
      const messages = result.issues.map((i) => i.message).join("; ");
      throw new ValidationError(`Content failed publish gate: ${messages}`);
    }
  }
}

export const publishGateService = new PublishGateService();
