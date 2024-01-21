import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "counterCharacters"
})
export class CounterCharactersPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): number {
    if (value) {
      return value.length;
    }

    return 0;
  }
}
