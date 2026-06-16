/**
 * front-door ablation — grading (the test oracle).
 *
 * SWE-bench Verified decides success by code execution: the hidden FAIL_TO_PASS
 * tests must now pass AND the PASS_TO_PASS regression guards must still pass
 * (Jimenez et al., arXiv:2310.06770). This module makes ONLY that decision — it
 * takes the set of test ids that passed after the agent's edits and returns a
 * verdict. Producing that set is the executor's job (execute.mjs); deciding from
 * it is pure. No model ever grades resolution.
 */

/**
 * @param {Set<string>|string[]} passingIds  test ids that passed post-edit
 * @param {{failToPass:string[], passToPass:string[]}} spec
 * @returns {{resolved:boolean, f2pPassed:boolean, p2pPassed:boolean,
 *   f2p:{passed:number,total:number}, p2p:{passed:number,total:number},
 *   missing:string[]}}
 */
export function gradeOutcome(passingIds, spec) {
  const passing = passingIds instanceof Set ? passingIds : new Set(passingIds);
  const failToPass = spec.failToPass ?? [];
  const passToPass = spec.passToPass ?? [];

  const f2pPass = failToPass.filter((id) => passing.has(id));
  const p2pPass = passToPass.filter((id) => passing.has(id));
  const f2pPassed = f2pPass.length === failToPass.length;
  const p2pPassed = p2pPass.length === passToPass.length;
  const missing = [...failToPass, ...passToPass].filter((id) => !passing.has(id));

  return {
    resolved: f2pPassed && p2pPassed,
    f2pPassed,
    p2pPassed,
    f2p: { passed: f2pPass.length, total: failToPass.length },
    p2p: { passed: p2pPass.length, total: passToPass.length },
    missing,
  };
}
