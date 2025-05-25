import { codeText } from "../utils/translate";

export const LanguageSelector = ({className = "", languages, language, setLanguage}: LanguageSelectorProps) => {
    return (
      <tr className={"text-start " + className}>
        <td>{codeText("nvlbl05", language)}:</td>
        <td>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white dark:bg-[#242424] rounded"
          >
            {Array.from(languages).map(([key, value], index) => (
              <option value={key} key={index}>
                {value}
              </option>
            ))}
          </select>
        </td>
      </tr>
    );
  };

interface LanguageSelectorProps {
  className?: string;
  languages: Map<string, string>;
  language: string;
  setLanguage: (language: string) => void;
}