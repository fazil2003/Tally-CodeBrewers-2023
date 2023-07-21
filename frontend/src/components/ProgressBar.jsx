const ProgressBar = (props) => {
  const st = {
    width: props.inpercent,
  };
  return (
    <div className="progressbar" id="progressbar">
      <p>{props.name}</p>
      <div className="progress">
        <div className="fill" style={st}></div>
      </div>
      <p>{props.percentage}%</p>
    </div>
  );
};

export default ProgressBar;
