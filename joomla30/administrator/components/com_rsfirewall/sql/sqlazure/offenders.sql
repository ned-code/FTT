CREATE TABLE [#__rsfirewall_offenders] (
  [id] int NOT NULL IDENTITY,
  [ip] varchar(64) NOT NULL,
  [date] datetime NOT NULL,
  PRIMARY KEY ([id])
);