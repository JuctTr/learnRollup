// tsconfig.json没有添加了path，所以报声明找不到的错误，这里当反面教材
import { moduleA } from "module-a";

console.log(moduleA);

export const a = 1;
