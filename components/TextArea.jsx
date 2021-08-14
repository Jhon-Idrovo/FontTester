function TextShowcase({ index, font, setActive, config }) {
  return (
    <div className="flex">
      <div className="p-2 flex flex-col justify-center items-center">
        <h6>Variants:</h6>
        <ul>
          {font.variants.map((v) => (
            <li>{v}</li>
          ))}
        </ul>
      </div>
      <textarea
        onClick={() => setActive(index)}
        className="pl-8"
        style={{
          fontFamily: `${font.family},serif`,
          backgroundColor: config.bgCol,
          color: config.txtCol,
        }}
        cols={500}
      ></textarea>
    </div>
  );
}

export default TextShowcase;
