import { Dfa, DfaExecution } from "../models/dfa";
import { StateView } from "./StateView";

class DfaView {
    dfa: Dfa;
    execution: DfaExecution;
    states: StateView[];
}