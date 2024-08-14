export type Tagged = {
  tag: number;
};

export function deserializeTagged(tagged: Tagged, reader: string): string {
  return `
    let taggedTag = ${reader}.readTaggedTag();
    if( taggedTag != ${tagged.tag}) {
      throw new Error("Expected tag ${tagged.tag}, got " + taggedTag);
    }
  `;
}

export function serializeTagged(tagged: Tagged, writer: string): string {
  return `
    ${writer}.writeTaggedTag(${tagged.tag});
  `;
}
