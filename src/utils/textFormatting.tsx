import React from 'react';

export function formatBrandText(text: string): React.ReactNode {
  if (!text) return text;
  const parts = text.split('A');
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className="font-lambda inline-block -mx-[0.05em] uppercase">Λ</span>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
