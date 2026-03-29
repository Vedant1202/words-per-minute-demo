import { Injectable } from '@nestjs/common';

export interface Paragraph {
  id: string;
  text: string;
}

@Injectable()
export class ParagraphsService {
  private readonly paragraphs: Paragraph[] = [
    {
      id: 'p1',
      text: 'The quick brown fox jumps over the lazy dog. Practice makes progress when you show up every day.',
    },
    {
      id: 'p2',
      text: 'Typing fluency comes from relaxed hands and steady rhythm. Breathe, find the home row, and keep going.',
    },
    {
      id: 'p3',
      text: 'Small habits compound into big changes. Focus on accuracy first; speed follows naturally with time.',
    },
    {
      id: 'p4',
      text: 'Code is read far more often than it is written. Clear names and short functions save everyone time.',
    },
    {
      id: 'p5',
      text: 'A calm mind solves problems faster than a rushed one. Pause, clarify the goal, then take the next step.',
    },
  ];

  getRandom(): Paragraph {
    const i = Math.floor(Math.random() * this.paragraphs.length);
    return this.paragraphs[i];
  }
}
