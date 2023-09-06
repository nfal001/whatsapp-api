import { prismaClient } from "../application/database.js";

async function onStateChanged(newState) {
  console.log(newState);
  if (newState === "CONFLICT") {
    console.log("CONFLICT detected");
    // do something here
  }
  if (newState === "DEPRECATED_VERSION") {
    console.log("DEPRECATED_VERSION detected");
    // do something here
  }
  if (newState === "OPENING") {
    console.log("OPENING detected");
    // do something here
  }
  if (newState === "PAIRING") {
    console.log("PAIRING detected");
    // do something here
  }
  if (newState === "PROXYBLOCK") {
    console.log("PROXYBLOCK detected");
    // do something here
  }
  if (newState === "SMB_TOS_BLOCK") {
    console.log("SMB_TOS_BLOCK detected");
    // do something here
  }
  if (newState === "TIMEOUT") {
    console.log("TIMEOUT detected");
    // do something here
  }
  if (newState === "TOS_BLOCK") {
    console.log("TOS_BLOCK detected");
    // do something here
  }
  if (newState === "UNLAUNCHED") {
    console.log("UNLAUNCHED detected");
    // do something here
  }
  if (newState === "UNPAIRED") {
    console.log("UNPAIRED detected");
    // do something here
  }
  if (newState === "UNPAIRED_IDLE") {
    console.log("UNPAIRED_IDLE detected");
    // do something here
  }
  await prismaClient.client.update({
    data: {
      state: newState,
    },
    where: {
      AND: [
        {
          id: this.id,
        },
        {
          client_name: this.clientInstanceName,
        },
      ],
    },
  });
};

export {
    onStateChanged
}
