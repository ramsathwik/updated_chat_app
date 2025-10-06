function messagehandler(e, msgRef) {
  e.preventDefault();
  let msg = msgRef.current.value;
  msgRef.current.value = "";
  return msg;
}
export default messagehandler;
