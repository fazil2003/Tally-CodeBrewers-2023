const Footer = (props) => {
  return (
    <div className="footer" id="footer">
      <p className="footer-name">
        Accuracy: <b>{props.accuracy}%</b>
      </p>
      <p className="footer-name">
        Speed: <b>{props.speed} wpm</b>
      </p>
    </div>
  );
};

export default Footer;
