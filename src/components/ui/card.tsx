import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white shadow rounded-2xl ${className}`}>{children}</div>
);

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
