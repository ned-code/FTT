<?php
defined('_JEXEC') or die;

?>
<div id="descendants" class="row-fluid">
    <div class="span6">
        <div class="well">
            <div class="css-treeview">
                <ul>
                    <li>
                        <input checked type="checkbox" id="item-0" />
                        <label for="item-0">
                            <?php
                            $parents = $tree['parents'];
                            echo $parents['father']->name() . " + " . $parents['mother']->name();
                            ?>
                        </label>
                        <ul>
                            <li>
                                <?php
                                echo $tree['childrens'][0]->name();
                                ?>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>

    </div>
    <div class="span6">
        <div class="well">

        </div>
        <hr>
    </div>
</div>
