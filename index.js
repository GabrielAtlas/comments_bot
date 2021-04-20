import * as dotenv from "dotenv";
import readline from "readline";

import { IgApiClient } from "instagram-private-api";

dotenv.config();

const ig = new IgApiClient();

ig.state.generateDevice(process.env.IG_USERNAME);

(async () => {
  await simulePreLoginFlow();

  const minLenght = await askQuestion("Número mínimo: ");

  const maxLenght = await askQuestion("Número máximo: ");

  var array = [];
  var i;

  for (i = minLenght; i <= maxLenght; i++) {
    array.push(i);
  }
  var requestID = 1;
  shuffle(array);
  array.forEach(async (item) => {
    console.log(
      `[Request - #${requestID}] Enviado comentário com o número ${item}`
    );
    await ig.live.comment(process.env.BROADCAST_ID, `${item}`);
    requestID += 1;
    sleep(4300);
  });
})();

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function simulePreLoginFlow() {
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login(
    process.env.IG_USERNAME,
    process.env.IG_PASSWORD
  );
  process.nextTick(async () => await ig.simulate.postLoginFlow());
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}
