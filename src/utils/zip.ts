function zip<T extends unknown[], P extends unknown[]>(arr1: T[], arr2: P[]) {
  const newArr: [T, P][] = [];
  const minLength = Math.min(arr1.length, arr2.length);

  for (let i = 0; i < minLength; i++) {
    newArr.push([arr1[i], arr2[i]]);
  }

  return newArr;
}

export default zip;
