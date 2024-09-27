import { Tooltip } from "antd";
import { FC } from "react";
type QuestionMarkSuggestionProp = {
  title: string;
};
const QuestionMarkSuggestion: FC<QuestionMarkSuggestionProp> = ({title}) => {
  return (
    <>
      <Tooltip className="mx-[10px]" title={title || "Extra information"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M11.967 12.75C12.967 11.75 13.967 11.3546 13.967 10.25C13.967 9.14543 13.0716 8.25 11.967 8.25C11.0351 8.25 10.252 8.88739 10.03 9.75M11.967 15.75H11.977M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#828282"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </Tooltip>
    </>
  );
};
export default QuestionMarkSuggestion;
