export default function messageReducer(
  changeMessage:any,
  action: { type: string; value: string | null }
) {
    switch (action.type) {
        case "changeMessage": {
          return {
            ...changeMessage,
            content:action.value
          };
        }
        default: {
          throw new Error("case not defined");
        }
      }
}
