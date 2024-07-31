import parse from 'html-react-parser';
const emailContentStyles = `
  .email-content blockquote {
    margin-left: 1em;
    padding-left: 1em;
    border-left: 2px solid #ccc;
    color: #555;
  }
  .email-content .gmail_attr {
    color: #777;
    font-size: 0.9em;
    margin-bottom: 0.5em;
  }
  .email-content * {
    color: inherit;
  }
`;

export default function ({ message, time }: any) {
    const sanitizeAndParseHtml = (html: string) => {
        // Basic sanitization
        console.log(html)
        let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        // Remove the gmail_quote div
        sanitized = sanitized.replace(/<div class="gmail_quote">[\s\S]*?<\/div>/gi, '');

        console.log(sanitized);

        // Parse the sanitized HTML
        return parse(sanitized);
    };
    return (
        <>
        <style>{emailContentStyles}</style>
        <div className="flex w-full mb-4">
          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-red rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-300">U</span>
          </div>
          <div className="w-[80%] ml-3 w-fit">
            <div className="rounded-tl-lg rounded-b-lg bg-blue-400 cursor-pointer p-2">
              <div className="email-content color-[#ADBAC7] m-0">
                {sanitizeAndParseHtml(message)}
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex items-center mt-2">
                <p className="text-xs">{time}</p>
              </div>
            </div>
          </div>
        </div>
      </>

    )
}