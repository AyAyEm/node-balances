"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
promises_1.default.readFile('./samples/uranoPop/use-p2').then((data) => console.log(data));
console.log(Buffer.from('T2BN0           0,080 kg      0,00 N1     0,00 E'));
exports.default = 'teste';
//# sourceMappingURL=newTest.js.map