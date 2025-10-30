import { writeFile, unlink, mkdtemp, readFile } from 'fs/promises';
import { join, extname } from 'path';
import { tmpdir } from 'os';
import scribe from 'scribe.js-ocr';
import type { Mastra } from '@mastra/core';
import { reportComparatorService } from '../agents/report_comparator.js';


export const processAndCompareReports = async (
  mastra: Mastra,
  sourceFile: File,
  targetFile: File
) => {
  let sourceFilePath: string | null = null;
  let targetFilePath: string | null = null;

  try {
    const tempDir = await mkdtemp(join(tmpdir(), 'report-comparator-'));

    const sourceBuffer = await sourceFile.arrayBuffer();
    sourceFilePath = join(tempDir, sourceFile.name);
    await writeFile(sourceFilePath, Buffer.from(sourceBuffer));

    const targetBuffer = await targetFile.arrayBuffer();
    targetFilePath = join(tempDir, targetFile.name);
    await writeFile(targetFilePath, Buffer.from(targetBuffer));

    let sourceText = '';
    let targetText = '';
    
    const sourceExt = extname(sourceFilePath).toLowerCase();
    const targetExt = extname(targetFilePath).toLowerCase();
    
    if (sourceExt === '.txt') {
      sourceText = await readFile(sourceFilePath, 'utf-8');
    } else {
      // Handle PDF files with OCR
      sourceText = await scribe.extractText([sourceFilePath]);
    }
    
    if (targetExt === '.txt') {
      targetText = await readFile(targetFilePath, 'utf-8');
    } else {
      // Extract text from PDF files with OCR
      targetText = await scribe.extractText([targetFilePath]);
    }
    
    await scribe.terminate();

    const result = await reportComparatorService(mastra, {
      sourceText: sourceText || '',
      targetText: targetText || ''
    });
    
    return result;
  } catch (error) {
    console.error('Error processing and comparing reports:', error);
    throw new Error('Failed to compare reports. Please check if files are valid PDF or TXT files.');
  } finally {
    if (sourceFilePath) {
      try {
        await unlink(sourceFilePath);
      } catch (e) {
        console.error('Error deleting source file:', e);
      }
    }
    if (targetFilePath) {
      try {
        await unlink(targetFilePath);
      } catch (e) {
        console.error('Error deleting target file:', e);
      }
    }
  }
};

