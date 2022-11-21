import {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  useState,
} from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactElement;
  error?: boolean;
  helperText?: string;
}

export const Input = forwardRef(
  (
    { placeholder, icon, value, error, helperText, ...inputProps }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [content, setContent] = useState<string>('');
    return (
      <div>
        <div className="relative max-w-md rounded-md bg-blue-dark-400 group">
          <p
            className={`absolute text-sm duration-200 -translate-y-1/2 pointer-events-none left-4 top-1/2 text-blue-dark-100 ${
              content
                ? 'top-4 text-xs'
                : 'group-focus-within:top-4 group-focus-within:text-xs'
            }`}
          >
            {placeholder}
          </p>
          <div className="absolute w-6 h-6 -translate-y-1/2 top-1/2 right-4 text-blue-dark-200">
            {icon}
          </div>
          <input
            ref={ref}
            {...inputProps}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full pl-4 ${
              icon ? 'pr-16' : 'pr-4'
            } pt-6 pb-3 text-sm bg-transparent outline-none text-blue-light-100`}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs capitalize text-red-light-100">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
