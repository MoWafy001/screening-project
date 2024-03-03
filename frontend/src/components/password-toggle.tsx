export const PasswordToggle = (props: { show: boolean }) => {
  return (
    <>
      {props.show ? (
        <i className="bi-eye-slash" style={{ fontSize: "1.5rem" }}></i>
      ) : (
        <i className="bi-eye" style={{ fontSize: "1.5rem" }}></i>
      )}
    </>
  );
};
