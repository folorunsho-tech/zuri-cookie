const useCookie = (operation, { cvalue, cname }) => {
  const getCookie = (cname) => {
    let decodedCookie = decodeURIComponent(document.cookie);
    let name = cname + "=";
    const found = decodedCookie.includes(name);
    if (found) {
      let data = decodedCookie
        .split("; ")
        .filter((c) => c.includes(cname + "="))[0];
      switch (cname) {
        case "range":
          return data.substring(data.indexOf("=") + 1).split(",");
        case "currStage":
          return data.substring(data.indexOf("=") + 1);
        case "points":
          return data.substring(data.indexOf("=") + 1);
        default:
          return data.substring(data.indexOf("=") + 1);
      }
    } else {
      return undefined;
    }
  };
  const d = new Date();
  d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  switch (operation) {
    case "create":
      cvalue = document.cookie = cname + "=" + cvalue + ";" + expires;
      return cvalue;
    case "read":
      cvalue = getCookie(cname);
      return cvalue;
    case "update":
      cvalue = document.cookie = cname + "=" + cvalue + ";" + expires;
      return cvalue;
    case "delete":
      cvalue = document.cookie =
        cname + "=" + cvalue + ";" + "expires=Thu, 01 Jan 1970 00:00:00 UTC";
      return cvalue;
    default:
      return (cvalue = document.cookie = cname + "=" + cvalue + ";" + expires);
  }
};

const setRange = () => {
  let range = useCookie("read", {
    cname: "range",
  });
  console.log(range);
  useCookie("create", {
    cname: "range",
    cvalue: [1, Number(range[1]) + 1],
  });
};
const nextStage = () => {
  let stage = useCookie("read", {
    cname: "currStage",
  });
  useCookie("create", {
    cname: "currStage",
    cvalue: Number(stage) + 1,
  });
  stage = useCookie("read", {
    cname: "currStage",
  });
  return stage;
};
const addPoint = () => {
  let points = useCookie("read", {
    cname: "points",
  });
  useCookie("create", {
    cname: "points",
    cvalue: Number(points) + 1,
  });
  points = useCookie("read", {
    cname: "points",
  });
  return points;
};
const startGame = () => {
  let username;
  let upperRange;
  let answer;

  const user = useCookie("read", {
    cname: "username",
  });

  if (user === "" || user === undefined) {
    useCookie("create", {
      cname: "range",
      cvalue: [1, 2],
    });
    useCookie("create", {
      cname: "currStage",
      cvalue: 1,
    });
    useCookie("create", {
      cname: "points",
      cvalue: 0,
    });
    username = prompt("Input Your Username") || "";
    useCookie("create", {
      cname: "username",
      cvalue: username,
    });
    answer = Number(prompt("Guess The Number"));
  } else {
    username = user;
    answer = Number(prompt("Guess The Number"));
  }

  return {
    upperRange,
    answer,
    username,
  };
};
const init = () => {
  const { answer, username } = startGame();
  let stage;
  let points;
  const range = useCookie("read", {
    cname: "range",
  });
  stage = useCookie("read", {
    cname: "currStage",
  });

  const generated = Math.floor(Math.random() * range[1] + 1);

  if (answer === generated) {
    points = addPoint();
    setRange();
    stage = nextStage();
    alert(`Correct Answer 
     Your Current Points is ${points}`);
    console.log({ generated, answer, username, stage });
  } else {
    alert("Wrong Answer, Try Again");
    console.log({ generated, answer, username, stage });
  }
};
init();
