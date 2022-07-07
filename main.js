import boom from "./sounds/boom.wav";
import open_hat from "./sounds/open_hat.wav";
import hi_hat from "./sounds/hi_hat.wav";
import clap from "./sounds/clap.wav";
import kick from "./sounds/kick.wav";
import ride from "./sounds/ride.wav";
import snare from "./sounds/snare.wav";
import tink from "./sounds/tink.wav";
import tom from "./sounds/tom.wav";

let app_mode = "";
// let record_mode = "";
// let playback_mode = "";

//start game button
const start_game_btn = document.getElementById("start_game");
start_game_btn.addEventListener("click", () => {
  if (app_mode === "game") {
    start_game_btn.textContent = "Start Game";
    app_mode = "";
  } else {
    start_game_btn.textContent = "End Game";
    app_mode = "game";
  }
});

//start recording button
const start_record_btn = document.getElementById("record");
start_record_btn.addEventListener("click", () => {
  if (app_mode === "record") {
    start_record_btn.textContent = "Record";
    app_mode = "";
    // record_array = [];
  } else {
    start_record_btn.textContent = "Stop Record";
    app_mode = "record";
  }
});

//array for drum beats
const key_config = [
  { id: "boom", key: "a", sound: boom },
  { id: "clap", key: "s", sound: clap },
  { id: "hi_hat", key: "d", sound: hi_hat },
  { id: "kick", key: "f", sound: kick },
  { id: "open_hat", key: "g", sound: open_hat },
  { id: "ride", key: "h", sound: ride },
  { id: "snare", key: "j", sound: snare },
  { id: "tink", key: "k", sound: tink },
  { id: "tom", key: "l", sound: tom },
];

const beats = ["f", "d", "f", "d", "f", "f", "d"];
const padding_count = 3;
const empty_array = Array(padding_count).fill("");

// <div class = "card sequence-card">A</div>
const targets = document.getElementById("targets");
let new_array = [...empty_array, ...beats, ...empty_array]; //... means open the arrays

//Game mode
let current_index = 0;
let score = 0;
const getActualPosition = () => current_index + padding_count;

const score_element = document.getElementById("score");

const updateTargets = () => {
  targets.innerHTML = "";
  const computed_array = new_array.slice(
    current_index,
    getActualPosition() + 4
  );
  // console.log(computed_array);
  computed_array.forEach((item, index) => {
    const target_div = document.createElement("div");
    target_div.setAttribute(
      "class",
      `card sequence-card ${index === 3 ? "active" : ""}`
    );
    target_div.textContent = item;
    targets.appendChild(target_div);
  });
  score_element.textContent = score;
};
updateTargets();

// key_config.map (another way to loop)

// <div id="boom" class="card control">
//   <div class="label container">Boom</div>
//   <div class="key container">A</div>
// </div>;

const parent = document.getElementById("controls");
key_config.forEach((k) => {
  const control_div = document.createElement("div");
  control_div.setAttribute("id", k.id);
  control_div.setAttribute("class", "card control");

  const control_label = document.createElement("div");
  control_label.setAttribute("class", "label container");
  control_label.textContent = k.key;

  const control_key = document.createElement("div");
  control_key.setAttribute("class", "key container");
  control_key.textContent = k.id;

  control_div.appendChild(control_label);
  control_div.appendChild(control_key);
  parent.appendChild(control_div);

  control_div.addEventListener("click", (e) => {
    const audio = new Audio(k.sound);
    audio.play();

    audio.onended = () => control_div.classList.remove("playing");
    control_div.classList.add("playing");
  });
  control_div.addEventListener("transitionend", () => {
    control_div.classList.remove("playing");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key.toLocaleLowerCase() === k.key) {
      const audio = new Audio(k.sound);
      audio.play();

      audio.onended = () => control_div.classList.remove("playing");
      control_div.classList.add("playing");

      // If user key natches current target key then we increment
      if (app_mode == "game" && new_array[getActualPosition()] === e.key) {
        current_index++;
        score++;
      }

      if (getActualPosition() >= new_array.length - padding_count - 1) {
      }

      if (app_mode === "record") {
        if (key_config.indexOf(e.key)) {
          const audio = key_config.find((obj) => obj.key === e.key);
          const newAudio = new Audio(audio.sound);
          saveRecord(e);
          newAudio.play();
        }
      }

      // if (app_mode === "playback") {
      // }

      updateTargets();
    }
  });
});

document.addEventListener("hover", () => {
  document.getElementById("control").style.transition = "all 2s";
});

// Record mode
let record_array = []; // record array

let record_time = Date.now(); // set the current record time

const saveRecord = (e) => {
  record_array.push({
    key: e.key, // push the record-key into the array
    duration: Date.now() - record_time,
  });

  console.log(record_array);
};

//start playback button
const start_playBack_btn = document.getElementById("playback");
start_playBack_btn.addEventListener("click", () => {
  if (app_mode === "") {
    record_array.forEach((k) => {
      key_config.forEach((h) => {
        if (h.key === k.key) {
          setTimeout(() => {
            const audio = new Audio(h.sound);
            audio.play();
            const control_div = document.getElementById(h.id);
            audio.onended = () => control_div.classList.remove("playing");
            control_div.classList.add("playing");
          }, k.duration);
        }
      });
    });
  }
});

// const playBack = (a) => {
//   a.forEach((key) => {
//     //console.log(data); // at least it works to display the console
//     const audio = key_config.find((obj) => obj.key === key.key);
//     const playback_sound = new Audio(audio.sound);
//     playback_sound.play();
//   });
// };
