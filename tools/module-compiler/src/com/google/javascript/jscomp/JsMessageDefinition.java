/*
 * Copyright 2008 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.javascript.jscomp;

import com.google.javascript.rhino.Node;

/**
 * Container class that holds information about jsmessage source.
 *
 * This class is specific to our JsMessage syntax. Allows you to use the
 * new-style or the old-style messages.
 *
 * Old-style:
 * <code>
 * var MSG_LEOPARD = 'Leopard';
 * var MSG_LEOPARD_HELP = 'The Leopard operating system';
 * </code>
 *
 * New-style:
 * <code>
 * /** @desc The leopard operating system * /
 * var MSG_LEOPARD = goog.getMsg('Leopard');
 * </code>
 *
 * @author anatol@google.com (Anatol Pomazau)
 */
class JsMessageDefinition {

  private final Node messageNode;
  private final Node messageParentNode;
  private final Node visitingNode;

  /**
   * Constructs js message definition.
   *
   * @param visitingNode Node that is visited by
   *     {@link JsMessageVisitor}. Take into
   *     account that visiting node could differ from the node the message
   *     was found.
   * @param messageNode A node that contains the message. It could be node with
   *     goog.getMsg() call or string/function for old-style messages.
   * @param messageParentNode The parent of the message node.
   */
  JsMessageDefinition(Node visitingNode, Node messageNode,
      Node messageParentNode) {

    this.messageNode = messageNode;
    this.visitingNode = visitingNode;
    this.messageParentNode = messageParentNode;
  }

  Node getMessageNode() {
    return messageNode;
  }

  Node getVisitingNode() {
    return visitingNode;
  }

 Node getMessageParentNode() {
    return messageParentNode;
  }
}
