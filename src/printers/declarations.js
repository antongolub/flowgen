/* @flow */
import type { RawNode } from '../nodes/node';

import printers from './index';

export const variableDeclaration = (node: RawNode) => {
  const declarations = node.declarationList.declarations
    .map(printers.node.printType).join(' ');

  return `declare ${printers.relationships.exporter(node)}var ${declarations};`;
}

export const interfaceType = (node: RawNode, withSemicolons: boolean = false) => {
  const members = node.members
    .map(member => {
      let str = '';

      if (member.jsDoc) {
        str += printers.common.comment(member.jsDoc);
      }

      return str + printers.node.printType(member);
    })
    .join(withSemicolons ? ';\n\t' : ',\n\t');

  return `{\t\n${members}\n}`;
}

export const interfaceDeclaration = (nodeName: string, node: RawNode) => {
  let heritage = '';

  // If the class is extending something
  if (node.heritageClauses) {
    heritage = node.heritageClauses.map(clause => {
      return clause.types.map(printers.node.printType).join(', ')
    }).join(', ');
    heritage = heritage.length > 0 ? `mixins ${heritage}` : '';
  }

  let str = `declare ${printers.relationships.exporter(node)}class ${nodeName}${printers.common.generics(node.typeParameters)} ${heritage} ${interfaceType(node)}`;

  return str;
}

export const typeDeclaration = (nodeName: string, node: RawNode) => {
  let str = `declare ${printers.relationships.exporter(node)}type ${nodeName}${printers.common.generics(node.typeParameters)} = ${printers.node.printType(node.type)};`;

  return str;
}

export const typeReference = (node: RawNode) => {
  if (node.typeName.left && node.typeName.right) {
    return printers.node.printType(node.typeName) + printers.common.generics(node.typeArguments);
  }

  return printers.relationships.namespaceProp(node.typeName.text, true) + printers.common.generics(node.typeArguments)
}

export const classDeclaration = (node: RawNode) => {
  let heritage = '';

  // If the class is extending something
  if (node.heritageClauses) {
    heritage = node.heritageClauses.map(clause => {
      return clause.types.map(printers.node.printType).join(', ')
    }).join(', ');
    heritage = heritage.length > 0 ? `mixins ${heritage}` : '';
  }

  let str = `declare ${printers.relationships.exporter(node)}class ${node.name.text}${printers.common.generics(node.typeParameters)} ${heritage} ${interfaceType(node, true)}`;

  return str;
}
