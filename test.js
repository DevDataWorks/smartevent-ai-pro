function test() {
  let values = [20, 50, 70, 90];

  values.forEach(v => {
    let result =
      v > 80 ? "HIGH" :
      v > 60 ? "MEDIUM" :
      v > 40 ? "LOW" : "SAFE";

    console.log(v + " => " + result);
  });
}

test();