// CONTENTWRAPPER FOR WRAPPING THE CONTENTS WITH COMMON STYLING
const ContentWrapper = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col w-full px-2 ${className}`}>{children}</div>
  );
};

export default ContentWrapper;
