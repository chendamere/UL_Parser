

// focus on what to manipulate

// const net = new brain.NeuralNetwork();

// net.train([
//   { input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 } },
//   { input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 } },
//   { input: { r: 0.5, g: 0.5, b: 1.0 }, output: { green: 1 } },
// ]);

// const output = net.run({ r: 1, g: 0.4, b: 0 }); // { white: 0.99, black: 0.002 }

// console.log(output)

import fs from 'fs'

import ProofAssistant from "./ProofAssistant.js";
import LatexParser from "./LatexParser.js";
import ProofStrategy from './ProofStrategy.js';

let latexparser = new LatexParser();
let allrules = [];

let tstatements = []
fs.readdirSync('./axiom/').forEach(file => {
    const chapter = latexparser.ParseFile( './axiom/', fs.readFileSync, file, false)
    for(const c of chapter.rules){
        let ret = latexparser.Parse(c)
        allrules.push(ret)
    }
})

let allexps = [];
fs.readdirSync('./theorems/').forEach(file => {
    let texps=[]
    let tts =[]
    let chapter = latexparser.ParseFile( './theorems/', fs.readFileSync, file, false)
    let exps = latexparser.trimExps(latexparser.ParseFile( './theorems/', fs.readFileSync, file, true))
    for(const e of exps){
        // console.log(e)
        let temp =[]
        for(const exp of e) {
            temp.push(exp.trim())
        }
        texps.push(temp)
    }
    for(const e of chapter.rules){
        tts.push(latexparser.Parse(e))
    }
    tstatements.push(tts)
    allexps.push(texps)
})

let pf = new ProofAssistant(allrules, latexparser, [])
// pf.PrintAllRules()
let r = pf.genRule('!, #13 1 , #100 $2 $1 , #13 1 , #102 $2 $1 , #13 1 , #5 1 , #6 1  ,#7 1 , #13 1 , @ ,')
let r2 = pf.genRule('!, #13 1 , #102 $1 $1 , #6 1 , #100 $1 $0 , #7 1 , #5 1, @ ,')
// let r2 = pf.genRule('!, #7 2 1 , #5 4, #4 5, @ ,')
// console.log(pf.OperandEquivalence(r, r2))
// console.log(pf.TrimAndCheck(r))
// console.log(pf.TrimAndCheck(r))
let x = pf.MatchandCheck(r2.leftexps, r2.rightexps)
for(const exp of x){
    console.log(pf.ExpToString(exp))
}
console.log()

// let ps = new ProofStrategy(pf, tstatements, allexps)
// ps.Init()s

// console.log(pf.Operands_normalize(r))
// console.log(r.leftexps)
// console.log(pf.firstIsSameBranch(r.leftexps,r.rightexps))
